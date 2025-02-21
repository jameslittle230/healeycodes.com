import siteConfig from "../siteConfig.json";

import fs from "fs";
import path from "path";
import imageSize from "image-size";

import React from "react";
import Link from "next/link";

import Markdown from "markdown-to-jsx";
import { getAllPostIds, getPostData, getNextAndPrevPosts } from "../lib/posts";

import Layout from "../components/layout";
import SpacedImage from "../components/image";
import Code from "../components/code";
import Date from "../components/date";
import Newsletter from "../components/newsletter";

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);

  const postImages = path.join(process.cwd(), "public", "posts", params.id);
  const imageMetadata = {};

  if (fs.existsSync(postImages)) {
    const imageFiles = fs.readdirSync(postImages);
    imageFiles.forEach((image) => {
      imageMetadata[image] = { ...imageSize(path.join(postImages, image)) };
    });
  }

  let prevPost = null;
  let nextPost = null;
  const nextAndPrevPosts = getNextAndPrevPosts(params.id);
  if (nextAndPrevPosts.previous !== null) {
    prevPost = {
      id: nextAndPrevPosts.previous,
      ...getPostData(nextAndPrevPosts.previous),
    };
  }
  if (nextAndPrevPosts.next !== null) {
    nextPost = {
      id: nextAndPrevPosts.next,
      ...getPostData(nextAndPrevPosts.next),
    };
  }

  return {
    props: {
      id: params.id,
      source: postData.content,
      imageMetadata,
      ...postData,
      prevPost,
      nextPost,
    },
  };
}

export default function Post({
  id,
  title,
  description,
  tags,
  date,
  imageMetadata,
  source,
  prevPost,
  nextPost,
}) {
  const seo = { title, description };

  return (
    <Layout {...seo}>
      <header>
        <h1 className="post-title">{title}</h1>
        <p className="post-date">
          <Date dateString={date} /> in{" "}
          {tags
            .map((tag, i) => (
              <Link href={`/tags/${tag}`} key={i}>
                {`${tag.charAt(0).toUpperCase()}${tag.slice(1)}`}
              </Link>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}{" "}
          — <a href={`${siteConfig.EDIT_POST_URL}/${id}.md`}>Edit on GitHub</a>
        </p>
      </header>
      <main className="post-text">
        <Markdown
          options={{
            // Here we can extend our plain Markdown posts with React components
            createElement(type, props, children) {
              if (type === "img") {
                return (
                  <SpacedImage
                    {...props} // @ts-ignore
                    src={`/posts/${id}/${props.src}`} // @ts-ignore
                    originalHeight={imageMetadata[props.src].height} // @ts-ignore
                    originalWidth={imageMetadata[props.src].width}
                    quality={100}
                  />
                ); // @ts-ignore
              } else if (type === "code" && props.className) { // @ts-ignore 
                const language = props.className.replace("lang-", "");
                return <Code children={children} language={language} />;
              }
              return React.createElement(type, props, children);
            },
          }}
        >
          {source}
        </Markdown>
      </main>
      <hr />
      <Newsletter />
      <div className="other-posts">
        {prevPost ? (
          <div className="other-posts-link">
            <Link href={`/${prevPost.id}`}>{`← ${prevPost.title}`}</Link>
          </div>
        ) : null}
        {nextPost ? (
          <div className="other-posts-link">
            <Link href={`/${nextPost.id}`}>{`${nextPost.title} →`}</Link>{" "}
          </div>
        ) : null}
      </div>
      <style jsx>{`
        header {
          padding-top: 16px;
          padding-bottom: 16px;
        }
        .post-title {
          margin-bottom: 0px;
          padding-bottom: 0px;
        }
        .post-text {
          padding-top: 16px;
        }
        .post-date {
          margin-top: 0px;
          padding-top: 8px;
          color: var(--light-text);
        }
        .other-posts {
          padding-top: 48px;
        }
        .other-posts-link {
          display: block;
          padding-bottom: 32px;
        }
      `}</style>
    </Layout>
  );
}
