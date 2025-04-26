import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AHP Decision Tool</h3>
            <p className="text-neutral-medium">
              A modern implementation of the Analytic Hierarchy Process to help students make better decisions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tool">
                  <a className="text-neutral-medium hover:text-white transition">Decision Tool</a>
                </Link>
              </li>
              <li>
                <Link href="/guide">
                  <a className="text-neutral-medium hover:text-white transition">Student Guide</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-neutral-medium hover:text-white transition">About AHP</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">References</h3>
            <p className="text-neutral-medium">
              This tool is inspired by the original work at{" "}
              <a href="https://bpmsg.com/ahp/" target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
                bpmsg.com/ahp
              </a>{" "}
              and is designed to make AHP more accessible to students.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-gray text-center text-neutral-medium">
          <p>© {new Date().getFullYear()} AHP Decision Tool for Students. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
