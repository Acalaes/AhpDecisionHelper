import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-dark">
          Analytic Hierarchy Process Decision Tool
        </h1>
        <p className="text-xl text-neutral-gray mb-8">
          A modern approach to complex decision making for students
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/tool">
              Start Making Decisions <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/guide">
              Learn How It Works
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Compare Alternatives</h3>
          <p className="text-neutral-gray">
            Easily compare multiple options based on your specific criteria using pairwise comparisons.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Save Time</h3>
          <p className="text-neutral-gray">
            Make complex decisions faster by breaking them down into simpler, manageable components.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
          <p className="text-neutral-gray">
            Get comprehensive analysis with visual representations of your decision priorities.
          </p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Common Use Cases for Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">College Selection</h3>
            <p className="text-sm text-neutral-gray">
              Compare universities based on academic programs, location, cost, and campus life.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Career Decisions</h3>
            <p className="text-sm text-neutral-gray">
              Evaluate job offers considering salary, benefits, location, and growth opportunities.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Research Topics</h3>
            <p className="text-sm text-neutral-gray">
              Select research topics based on interest, resources, and academic impact.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Course Selection</h3>
            <p className="text-sm text-neutral-gray">
              Choose elective courses by weighing difficulty, interest, and relevance to career.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Group Projects</h3>
            <p className="text-sm text-neutral-gray">
              Decide on project approaches collectively by evaluating alternatives objectively.
            </p>
          </div>
          <div className="border border-neutral-medium rounded-lg p-4">
            <h3 className="font-semibold mb-2">Technology Purchases</h3>
            <p className="text-sm text-neutral-gray">
              Compare laptops, phones, or software based on specifications, price, and reviews.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Make Better Decisions?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Start using our AHP Decision Tool today and experience a structured approach to decision making.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/tool">Get Started Now</Link>
        </Button>
      </div>
    </div>
  );
}
