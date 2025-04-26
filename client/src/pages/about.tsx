import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

export default function About() {
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark mb-4">About AHP</h2>

          <div className="prose max-w-none">
            <p>
              The Analytic Hierarchy Process (AHP) is a structured technique for organizing and analyzing complex decisions.
              Developed by Thomas L. Saaty in the 1970s, it has become one of the most widely used methods for multi-criteria decision making.
            </p>

            <h3>Key Advantages of AHP</h3>
            <ul>
              <li>Combines both qualitative and quantitative factors in decision making</li>
              <li>Provides a structured way to handle complex, multi-faceted decisions</li>
              <li>Allows for consistency checks to validate the decision process</li>
              <li>Helps create consensus among decision makers</li>
              <li>Produces numerical priorities that can be easily compared</li>
            </ul>

            <h3>Applications of AHP</h3>
            <p>
              AHP is used across numerous fields including business strategy, public policy, resource allocation,
              healthcare, engineering, and education. Some common applications include:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Business</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Vendor selection</li>
                  <li>Product evaluation</li>
                  <li>Project prioritization</li>
                  <li>Investment decisions</li>
                </ul>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Government</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Policy evaluation</li>
                  <li>Resource allocation</li>
                  <li>Urban planning</li>
                  <li>Risk assessment</li>
                </ul>
              </div>
              <div className="bg-neutral-light p-4 rounded-lg">
                <h4 className="font-medium mb-2">Personal</h4>
                <ul className="list-disc list-inside text-sm">
                  <li>Career choices</li>
                  <li>Major purchases</li>
                  <li>School selection</li>
                  <li>Housing decisions</li>
                </ul>
              </div>
            </div>

            <h3>Mathematical Foundation</h3>
            <p>
              AHP uses matrix algebra to determine the weights and priorities. The process involves:
            </p>
            <ol>
              <li>Creating comparison matrices</li>
              <li>Computing the principal eigenvector to derive priorities</li>
              <li>Calculating the consistency ratio to verify judgment consistency</li>
              <li>Synthesizing the results to determine overall rankings</li>
            </ol>

            <div className="bg-neutral-lightest p-4 rounded-lg border border-neutral-medium mt-6">
              <p className="font-medium mb-2">Further Learning Resources:</p>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://en.wikipedia.org/wiki/Analytic_hierarchy_process" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Wikipedia: Analytic Hierarchy Process
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.youtube.com/watch?v=J4T70o8gjlk" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Video Tutorial: Introduction to AHP
                  </a>
                </li>
                <li>
                  <a 
                    href="https://bpmsg.com/ahp/" 
                    className="text-primary hover:underline flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    BPMSG AHP Online System
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
