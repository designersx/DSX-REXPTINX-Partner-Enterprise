// // project-imports
// import AgentList from 'views/build/AgentList';
// import { useParams } from 'next/navigation';


// // ==============================|| SAMPLE PAGE ||============================== //

// export default function SamplePage() {
//   return <AgentList />;
// }



'use client'; // if you want to use hooks

import { useParams } from 'next/navigation';
import AgentList from 'views/build/AgentList';


const AgentsPage = () => {
  const params = useParams();
  const { type } = params; // 'my', 'regional', 'enterprise'

  if (!type) return <div>Loading...</div>;

   return <AgentList type={type} />;

};

export default AgentsPage;
