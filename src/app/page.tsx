// Home page — redirects to subjects hub
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/subjects');
}