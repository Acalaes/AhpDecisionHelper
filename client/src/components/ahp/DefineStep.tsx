import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, ArrowRight, Trash2 } from "lucide-react";
import { Criterion, Alternative } from "@shared/schema";
import { generateId } from "@/lib/utils";

interface DefineStepProps {
  problemName: string;
  criteria: Criterion[];
  alternatives: Alternative[];
  onProblemNameChange: (name: string) => void;
  onCriteriaChange: (criteria: Criterion[]) => void;
  onAlternativesChange: (alternatives: Alternative[]) => void;
  onNext: () => void;
}

export default function DefineStep({
  problemName,
  criteria,
  alternatives,
  onProblemNameChange,
  onCriteriaChange,
  onAlternativesChange,
  onNext,
}: DefineStepProps) {
  const [nameErrors, setNameErrors] = useState<{ [key: string]: boolean }>({});
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Reset validation messages when inputs change
  useEffect(() => {
    setValidationMessage(null);
  }, [problemName, criteria, alternatives]);

  const addCriterion = () => {
    onCriteriaChange([...criteria, { id: generateId(), name: "" }]);
  };

  const updateCriterion = (id: string, name: string) => {
    const updated = criteria.map((c) => (c.id === id ? { ...c, name } : c));
    onCriteriaChange(updated);

    // Track empty fields
    if (!name.trim()) {
      setNameErrors((prev) => ({ ...prev, [id]: true }));
    } else {
      setNameErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const removeCriterion = (id: string) => {
    onCriteriaChange(criteria.filter((c) => c.id !== id));
    
    // Remove from errors if exists
    setNameErrors((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const addAlternative = () => {
    onAlternativesChange([...alternatives, { id: generateId(), name: "" }]);
  };

  const updateAlternative = (id: string, name: string) => {
    const updated = alternatives.map((a) => (a.id === id ? { ...a, name } : a));
    onAlternativesChange(updated);

    // Track empty fields
    if (!name.trim()) {
      setNameErrors((prev) => ({ ...prev, [id]: true }));
    } else {
      setNameErrors((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const removeAlternative = (id: string) => {
    onAlternativesChange(alternatives.filter((a) => a.id !== id));
    
    // Remove from errors if exists
    setNameErrors((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleNext = () => {
    // Validate before proceeding
    if (!problemName.trim()) {
      setValidationMessage("Please enter a decision problem name");
      return;
    }

    if (criteria.length < 2) {
      setValidationMessage("You need at least 2 criteria");
      return;
    }

    if (alternatives.length < 2) {
      setValidationMessage("You need at least 2 alternatives");
      return;
    }

    // Check for empty names
    const emptyCriteria = criteria.filter(c => !c.name.trim());
    const emptyAlternatives = alternatives.filter(a => !a.name.trim());

    if (emptyCriteria.length > 0 || emptyAlternatives.length > 0) {
      setValidationMessage("All criteria and alternatives must have names");
      return;
    }

    onNext();
  };

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="problem-name" className="block text-sm font-medium text-neutral-dark mb-1">
          Decision Problem
        </label>
        <Input
          id="problem-name"
          placeholder="e.g., Selecting a Laptop"
          value={problemName}
          onChange={(e) => onProblemNameChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Criteria Editor */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-neutral-dark">Decision Criteria</label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addCriterion}
            className="text-primary hover:text-primary-dark text-sm flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add Criterion
          </Button>
        </div>

        <div className="space-y-2">
          {criteria.map((criterion) => (
            <div key={criterion.id} className="flex items-center">
              <Input
                placeholder="Criterion name"
                value={criterion.name}
                onChange={(e) => updateCriterion(criterion.id, e.target.value)}
                className={nameErrors[criterion.id] ? "border-destructive" : ""}
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeCriterion(criterion.id)}
                className="ml-2 text-neutral-gray hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Alternatives Editor */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-neutral-dark">Decision Alternatives</label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addAlternative}
            className="text-primary hover:text-primary-dark text-sm flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add Alternative
          </Button>
        </div>

        <div className="space-y-2">
          {alternatives.map((alternative) => (
            <div key={alternative.id} className="flex items-center">
              <Input
                placeholder="Alternative name"
                value={alternative.name}
                onChange={(e) => updateAlternative(alternative.id, e.target.value)}
                className={nameErrors[alternative.id] ? "border-destructive" : ""}
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeAlternative(alternative.id)}
                className="ml-2 text-neutral-gray hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {validationMessage && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
          {validationMessage}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} className="flex items-center">
          Next <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
