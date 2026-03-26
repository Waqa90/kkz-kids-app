import SubjectContent from './components/SubjectContent';

interface PageProps {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ child?: string }>;
}

export default async function SubjectPage({ params, searchParams }: PageProps) {
  const { subject } = await params;
  const { child } = await searchParams;
  return <SubjectContent subject={subject} child={child} />;
}
