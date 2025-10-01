// // project-imports
// // import Create from 'views/build/EditAgent';
// import AgentConfig from 'views/build/AgentConfig';

// // ==============================|| SAMPLE PAGE ||============================== //
// export default async  function SamplePage({ params }) {
//    const { agentId } = await params;

//   // return <Create agentId={agentId} />;
//   return <AgentConfig/>;
// }


// project-imports
// import Create from 'views/build/EditAgent';
import AgentConfig from 'views/build/AgentConfig';

// ==============================|| SAMPLE PAGE ||============================== //
export default async  function SamplePage({ params }) {
   const { agentId } = await params;

  // return <Create agentId={agentId} />;
  return <AgentConfig agentId={agentId}/>;
}
