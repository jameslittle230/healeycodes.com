import siteConfig from "../siteConfig.json";
import games from "../data/games";
import projects from "../data/projects";

import Link from "next/link";

import Layout from "../components/layout";

export default function Projects() {
  return (
    <Layout
      title="Projects"
      description="Some of the software I've released. Some of the projects are fun
experiments and others are used by people everyday!"
    >
      <h1>Open Source</h1>
      <main>
        <p>
          Here's some of the software I've released. Some of the projects are
          fun experiments and others are used by people everyday! I'm accepting
          pull requests and issues on all of them — and I'm happy to onboard
          you.
        </p>
        <h2>Projects</h2>
        <div className="project-list">
          {projects.map((project, i) => (
            <div className="project" key={i}>
              <a href={project.link} target="_blank">
                {project.name}
              </a>
              <p className="project-desc">{project.desc}</p>
              {project.to ? (
                <p className="project-post">
                  Read my <Link href={project.to}>write-up</Link>.
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <h2>Games</h2>
        <div className="project-list">
          {games.map((game, i) => (
            <div className="project" key={i}>
              <a href={game.link} target="_blank">
                {game.name}
              </a>
              <p className="project-desc">{game.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        .project {
          flex: 50%;
          padding-right: 20px;
          padding-bottom: 28px;
        }
        .project-desc {
          margin-top: 4px;
          margin-bottom: 0px;
        }
        .project-post {
          margin-top: 0px;
          color: var(--light-text);
        }
        .project-list {
          display: flex;
          flex-wrap: wrap;
        }
        @media only screen and (max-width: ${siteConfig.LAYOUT_WIDTH}px) {
          .project-list {
            display: block;
          }
          .project {
            padding-right: 0px;
          }
        }
      `}</style>
    </Layout>
  );
}
