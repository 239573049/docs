import React, { Suspense } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';


export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`欢迎浏览${siteConfig.title}笔记`}
      description="在这里您将看到token的笔记分享">
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
