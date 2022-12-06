import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Lottie from 'lottie-react';
import logo from '../../../static/json/logo.json'
import erji from '../../../static/json/数码动态包框.json'
import bg from '../../../static/json/bg.json'

type FeatureItem = {
  title: JSX.Element | string;
  Svg: JSX.Element;
  description: JSX.Element;
};


const FeatureList: FeatureItem[] = [
  {
    title: '超多技术分享来自于token！',
    Svg: <Lottie style={{ height: '150px' }} animationData={logo} loop={true} />,
    description: (
      <>
        文档正在完善中！
      </>
    ),
  },
  {
    title: "可以与token一块分享技术",
    Svg: <Lottie style={{ height: '150px' }} animationData={erji} loop={true} />,
    description:
      <>
        .Net 技术交流群：737776595
      </>,
  },
  {
    title: '欢迎帮助token一块补充文档',
    Svg: <Lottie style={{ height: '150px' }} animationData={bg} loop={true} />,
    description: (
      <>
        欢迎一块帮助token完善技术分享的问题，有技术分享可以连接token一块学习
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg}
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
