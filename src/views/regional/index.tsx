
import ElevenLabsWidget from "./ElevenLabsWidget";
import RegionalAgentsView from "./RegionalAgentsView";


// ==============================|| CONTACT US - MAIN ||============================== //
export default function index() {
    return <>
        <RegionalAgentsView />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <ElevenLabsWidget />


        </div></>



}