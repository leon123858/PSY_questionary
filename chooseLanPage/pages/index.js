import Head from 'next/head';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import Entity from '../component/entity';

const { Header, Footer, Content } = Layout;

export default function Home() {
	return (
		<div className='container'>
			<Head>
				<title>language</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main>
				<Layout>
					<Header style={{ backgroundColor: 'white' }}></Header>
					<Content style={{ backgroundColor: 'white' }}>
						<Entity />
					</Content>
				</Layout>
			</main>
		</div>
	);
}
