import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function Guide() {
  return (
    <section className="mb-12">
      <Card>
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-dark mb-4">AHP Guide for Students</h2>

          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-ahp">
                <AccordionTrigger className="text-left font-medium">
                  What is the Analytic Hierarchy Process (AHP)?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    The Analytic Hierarchy Process (AHP) is a structured technique for organizing and analyzing complex decisions,
                    developed by Thomas L. Saaty in the 1970s. It helps decision-makers find the option that best suits their needs and understanding of the problem.
                  </p>
                  <p>
                    AHP breaks down a decision problem into a hierarchy of sub-problems that can be more easily comprehended and evaluated.
                    It then evaluates various alternative solutions through pairwise comparisons of criteria and alternatives.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="when-to-use">
                <AccordionTrigger className="text-left font-medium">
                  When to Use AHP?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-2">AHP is useful in situations where:</p>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Multiple criteria need to be considered</li>
                    <li>Some criteria are subjective or difficult to measure</li>
                    <li>Multiple stakeholders are involved in the decision</li>
                    <li>Several alternatives need to be evaluated</li>
                    <li>The decision has significant consequences</li>
                  </ul>
                  <p>
                    Examples include purchase decisions, project selection, vendor evaluation, resource allocation, and policy decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="understanding-scale">
                <AccordionTrigger className="text-left font-medium">
                  Understanding the AHP Scale
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    AHP uses a 1-9 scale for pairwise comparisons:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-neutral-dark">
                      <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                        <tr>
                          <th className="px-6 py-3">Scale</th>
                          <th className="px-6 py-3">Definition</th>
                          <th className="px-6 py-3">Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">1</td>
                          <td className="px-6 py-2">Equal importance</td>
                          <td className="px-6 py-2">Two elements contribute equally to the objective</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">3</td>
                          <td className="px-6 py-2">Moderate importance</td>
                          <td className="px-6 py-2">Experience and judgment slightly favor one element over another</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">5</td>
                          <td className="px-6 py-2">Strong importance</td>
                          <td className="px-6 py-2">Experience and judgment strongly favor one element over another</td>
                        </tr>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-2">7</td>
                          <td className="px-6 py-2">Very strong importance</td>
                          <td className="px-6 py-2">One element is favored very strongly over another</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-2">9</td>
                          <td className="px-6 py-2">Extreme importance</td>
                          <td className="px-6 py-2">The evidence favoring one element over another is of the highest possible order</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step-by-step">
                <AccordionTrigger className="text-left font-medium">
                  Step-by-Step AHP Process
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <ol className="list-decimal list-inside space-y-3">
                    <li>
                      <div className="font-medium">Define the problem and goal</div>
                      <p className="ml-6 mt-1">Clearly state what decision needs to be made.</p>
                    </li>
                    <li>
                      <div className="font-medium">Structure the decision hierarchy</div>
                      <p className="ml-6 mt-1">Identify criteria, sub-criteria, and alternatives.</p>
                    </li>
                    <li>
                      <div className="font-medium">Construct pairwise comparison matrices</div>
                      <p className="ml-6 mt-1">Compare each element with every other element at its level.</p>
                    </li>
                    <li>
                      <div className="font-medium">Calculate priorities (weights)</div>
                      <p className="ml-6 mt-1">Synthesize judgments to determine priorities.</p>
                    </li>
                    <li>
                      <div className="font-medium">Check consistency</div>
                      <p className="ml-6 mt-1">Ensure comparisons are consistent (CR &lt; 0.1).</p>
                    </li>
                    <li>
                      <div className="font-medium">Combine criteria weights with alternative scores</div>
                      <p className="ml-6 mt-1">Calculate overall priority for each alternative.</p>
                    </li>
                    <li>
                      <div className="font-medium">Make final decision</div>
                      <p className="ml-6 mt-1">Select the alternative with the highest overall priority score.</p>
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="consistency-ratio">
                <AccordionTrigger className="text-left font-medium">
                  Understanding Consistency Ratio (CR)
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 bg-neutral-lightest px-4 rounded-b-md">
                  <p className="mb-3">
                    The Consistency Ratio (CR) measures how consistent your pairwise comparisons are. Inconsistency can occur when making multiple comparisons.
                  </p>
                  <p className="mb-3">
                    For example, if you say A is twice as important as B, and B is three times as important as C, then logically A should be six times as important as C.
                    If your judgment differs significantly from this, your comparisons are inconsistent.
                  </p>
                  <p className="mb-3">
                    <strong>CR &lt; 0.1</strong> is generally considered acceptable. If CR &gt; 0.1, you should review and revise your judgments.
                  </p>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-lg">
                    <p className="font-medium">Example of Inconsistency:</p>
                    <p>If you say:</p>
                    <ul className="list-disc list-inside mb-2">
                      <li>A is 3 times more important than B</li>
                      <li>B is 2 times more important than C</li>
                      <li>C is 2 times more important than A</li>
                    </ul>
                    <p>This creates a circular inconsistency that needs to be resolved.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
