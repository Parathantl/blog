import Link from 'next/link';
import ProjectsList from '../components/portfolio/ProjectsList';
import SkillsSection from '../components/portfolio/SkillsSection';

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
          <p className="text-xl text-blue-100">
            Explore my projects, skills, and professional journey
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/portfolio/about"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              About Me
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Learn more about my background
            </p>
          </Link>
          <Link
            href="/portfolio/projects"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              View my development work
            </p>
          </Link>
          <Link
            href="/portfolio/skills"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Skills
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Technologies I work with
            </p>
          </Link>
          <Link
            href="/portfolio/experience"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Experience
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              My professional journey
            </p>
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <Link
            href="/portfolio/projects"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>
        <ProjectsList featured={true} limit={3} />
      </section>

      {/* Skills Preview */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Skills & Technologies
          </h2>
          <Link
            href="/portfolio/skills"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>
        <SkillsSection />
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Have a project in mind? I&apos;d love to hear from you!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
