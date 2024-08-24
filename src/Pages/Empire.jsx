
import { useParams } from "react-router-dom";
import { empires } from "../constants";
import './Empire.css';


const Empire = () => {
    const { empireId } = useParams();
    const empire = empires[empireId];

    var divStyle = {
        backgroundImage: 'url('+ empire.backgroundImage +')',
        backgroundSize: "cover"
    };

    return (
        <div className="App">
            <div className="empire-content" style={divStyle}>
                <div>{empire.name}</div>
                <div>{empire.id}</div>
            </div>
        </div>
    );
};

export default Empire;