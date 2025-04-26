import { AHPDecision, ComparisonMatrix, AlternativeComparisons } from "@shared/schema";

// Random Index values for consistency ratio calculation
// These are standard values used in AHP for matrices of different sizes
const RI = [0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

/**
 * Create an identity matrix of size n
 */
export function createIdentityMatrix(n: number): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = i === j ? 1 : 0;
    }
  }
  return matrix;
}

/**
 * Create a reciprocal comparison matrix from pairwise comparisons
 * @param n The size of the matrix
 * @param comparisons Array of [row, col, value] entries representing pairwise comparisons
 */
export function createComparisonMatrix(n: number, comparisons: [number, number, number][]): number[][] {
  // Create identity matrix first (diagonal elements are 1)
  const matrix = createIdentityMatrix(n);
  
  // Fill in the pairwise comparisons
  for (const [row, col, value] of comparisons) {
    matrix[row][col] = value;
    matrix[col][row] = 1 / value; // Reciprocal value
  }
  
  return matrix;
}

/**
 * Calculate the principal eigenvector of a matrix using the power method
 * This is used to derive priorities from pairwise comparison matrices
 */
export function calculateEigenvector(matrix: number[][]): number[] {
  const n = matrix.length;
  let vector = Array(n).fill(1 / n); // Initial guess
  
  // Apply power iteration method (simplified for AHP)
  for (let iter = 0; iter < 20; iter++) { // 20 iterations should be sufficient
    // Multiply matrix by vector
    const newVector = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newVector[i] += matrix[i][j] * vector[j];
      }
    }
    
    // Normalize
    const sum = newVector.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) {
      newVector[i] /= sum;
    }
    
    // Check convergence
    const diff = Math.max(...newVector.map((v, i) => Math.abs(v - vector[i])));
    if (diff < 1e-10) break;
    
    vector = newVector;
  }
  
  return vector;
}

/**
 * Calculate the consistency ratio of a comparison matrix
 * CR = CI / RI where CI is the consistency index and RI is the random index
 */
export function calculateConsistencyRatio(matrix: number[][], priorities: number[]): number {
  const n = matrix.length;
  
  if (n <= 2) return 0; // Consistency is always perfect for n <= 2
  
  // Calculate λmax (principal eigenvalue)
  let lambdaMax = 0;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i][j] * priorities[j];
    }
    lambdaMax += sum / priorities[i];
  }
  lambdaMax /= n;
  
  // Calculate consistency index
  const CI = (lambdaMax - n) / (n - 1);
  
  // Calculate consistency ratio
  const consistencyRatio = CI / RI[n];
  
  return consistencyRatio;
}

/**
 * Process a pairwise comparison into a complete matrix with priorities and consistency ratio
 */
export function processComparisonMatrix(n: number, comparisons: [number, number, number][]): ComparisonMatrix {
  const matrix = createComparisonMatrix(n, comparisons);
  const priorities = calculateEigenvector(matrix);
  const consistencyRatio = calculateConsistencyRatio(matrix, priorities);
  
  return {
    matrix,
    priorities,
    consistencyRatio
  };
}

/**
 * Calculate overall priorities (final ranking) from criteria priorities and alternative priorities
 */
export function calculateOverallPriorities(
  decision: AHPDecision
): { [alternativeId: string]: number } {
  const { criteria, alternatives, criteriaComparisons, alternativeComparisons } = decision;
  
  const result: { [alternativeId: string]: number } = {};
  
  // Initialize result with zeros
  alternatives.forEach(alt => {
    result[alt.id] = 0;
  });
  
  // For each criterion, add its weighted contribution to each alternative
  criteria.forEach((criterion, criterionIndex) => {
    const criterionWeight = criteriaComparisons.priorities[criterionIndex];
    const altComparison = alternativeComparisons[criterion.id];
    
    if (altComparison) {
      alternatives.forEach((alternative, altIndex) => {
        const altWeight = altComparison.priorities[altIndex];
        result[alternative.id] += criterionWeight * altWeight;
      });
    }
  });
  
  return result;
}

/**
 * Check if a decision is complete and ready for final calculation
 */
export function isDecisionComplete(decision: AHPDecision): boolean {
  const { criteria, alternatives, criteriaComparisons, alternativeComparisons } = decision;
  
  // Check if criteria comparisons are complete
  if (!criteriaComparisons.matrix || criteriaComparisons.matrix.length !== criteria.length) {
    return false;
  }
  
  // Check if all alternative comparisons are complete
  for (const criterion of criteria) {
    const comparison = alternativeComparisons[criterion.id];
    if (!comparison || !comparison.matrix || comparison.matrix.length !== alternatives.length) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create an empty decision structure
 */
export function createEmptyDecision(name: string = ""): AHPDecision {
  return {
    name,
    criteria: [],
    alternatives: [],
    criteriaComparisons: {
      matrix: [],
      priorities: [],
      consistencyRatio: 0
    },
    alternativeComparisons: {},
    createdAt: new Date().toISOString()
  };
}

/**
 * Update the criteria comparisons matrix when criteria are added or removed
 */
export function updateCriteriaComparisons(
  criteriaComparisons: ComparisonMatrix,
  oldCriteriaIds: string[],
  newCriteriaIds: string[]
): ComparisonMatrix {
  const oldSize = oldCriteriaIds.length;
  const newSize = newCriteriaIds.length;
  
  if (oldSize === 0 || !criteriaComparisons.matrix) {
    // Initialize a new identity matrix
    const matrix = createIdentityMatrix(newSize);
    return {
      matrix,
      priorities: calculateEigenvector(matrix),
      consistencyRatio: 0
    };
  }
  
  // Create a mapping from old criteria indices to new ones
  const mapping: { [oldIndex: number]: number } = {};
  oldCriteriaIds.forEach((id, oldIndex) => {
    const newIndex = newCriteriaIds.indexOf(id);
    if (newIndex !== -1) {
      mapping[oldIndex] = newIndex;
    }
  });
  
  // Create a new matrix with appropriate size
  const newMatrix = createIdentityMatrix(newSize);
  
  // Copy values from old matrix where possible
  Object.entries(mapping).forEach(([oldIndexStr, newIndex]) => {
    const oldIndex = parseInt(oldIndexStr);
    Object.entries(mapping).forEach(([otherOldIndexStr, otherNewIndex]) => {
      const otherOldIndex = parseInt(otherOldIndexStr);
      if (oldIndex !== otherOldIndex) {
        newMatrix[newIndex][otherNewIndex] = criteriaComparisons.matrix[oldIndex][otherOldIndex];
      }
    });
  });
  
  const priorities = calculateEigenvector(newMatrix);
  const consistencyRatio = calculateConsistencyRatio(newMatrix, priorities);
  
  return {
    matrix: newMatrix,
    priorities,
    consistencyRatio
  };
}

/**
 * Update alternative comparisons matrices when alternatives or criteria change
 */
export function updateAlternativeComparisons(
  alternativeComparisons: AlternativeComparisons,
  criteriaIds: string[],
  oldAlternativeIds: string[],
  newAlternativeIds: string[]
): AlternativeComparisons {
  const newComparisons: AlternativeComparisons = {};
  const oldSize = oldAlternativeIds.length;
  const newSize = newAlternativeIds.length;
  
  criteriaIds.forEach(criterionId => {
    const oldComparison = alternativeComparisons[criterionId];
    
    if (!oldComparison || oldSize === 0 || !oldComparison.matrix) {
      // Initialize a new identity matrix
      const matrix = createIdentityMatrix(newSize);
      newComparisons[criterionId] = {
        matrix,
        priorities: calculateEigenvector(matrix),
        consistencyRatio: 0
      };
      return;
    }
    
    // Create a mapping from old alternative indices to new ones
    const mapping: { [oldIndex: number]: number } = {};
    oldAlternativeIds.forEach((id, oldIndex) => {
      const newIndex = newAlternativeIds.indexOf(id);
      if (newIndex !== -1) {
        mapping[oldIndex] = newIndex;
      }
    });
    
    // Create a new matrix with appropriate size
    const newMatrix = createIdentityMatrix(newSize);
    
    // Copy values from old matrix where possible
    Object.entries(mapping).forEach(([oldIndexStr, newIndex]) => {
      const oldIndex = parseInt(oldIndexStr);
      Object.entries(mapping).forEach(([otherOldIndexStr, otherNewIndex]) => {
        const otherOldIndex = parseInt(otherOldIndexStr);
        if (oldIndex !== otherOldIndex) {
          newMatrix[newIndex][otherNewIndex] = oldComparison.matrix[oldIndex][otherOldIndex];
        }
      });
    });
    
    const priorities = calculateEigenvector(newMatrix);
    const consistencyRatio = calculateConsistencyRatio(newMatrix, priorities);
    
    newComparisons[criterionId] = {
      matrix: newMatrix,
      priorities,
      consistencyRatio
    };
  });
  
  return newComparisons;
}
