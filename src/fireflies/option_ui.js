import React from "react";
import Simulation from "./simulation";
import WebGlWrapper from "./renderer";
import ReactWrapper from "./react_wrapper";
import "./option_ui_style.css";


export default function OptionUi(props) {
    let [open, setOpen] = React.useState(true);
    let [options, setOptions] = React.useState({
        simulation: {
            ...Simulation.getDefaultOptions(),
            count: 0,
        },
        render: {
            ...WebGlWrapper.getDefaultOptions(),
            size: 5,
        },
    });

    function renderOptionMenu() {
        return (
            <React.Fragment>
                <label htmlFor="size">Render Size</label>
                <input id="size" type="number" value={options.render.size} step={0.5} min={0.5} max={100}
                       onChange={e => setOptions({...options, ...{render: {size: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="charge_rate">Charge Rate</label>
                <input id="charge_rate" type="number" value={options.simulation.charge_rate} step={0.001} min={0.001} max={1}
                       onChange={e => setOptions({...options, ...{simulation: {charge_rate: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="drain_rate">Drain Rate</label>
                <input id="drain_rate" type="number" value={options.simulation.drain_rate} step={0.001} min={0.001} max={1}
                       onChange={e => setOptions({...options, ...{simulation: {drain_rate: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="radius">Influence Radius</label>
                <input id="radius" type="number" value={options.simulation.radius} step={10} min={10} max={500}
                       onChange={e => setOptions({...options, ...{simulation: {radius: parseInt(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="influence">Influence</label>
                <input id="influence" type="number" value={options.simulation.influence} step={0.01} min={0.01} max={1}
                       onChange={e => setOptions({...options, ...{simulation: {influence: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="max_velocity">Max Velocity</label>
                <input id="max_velocity" type="number" value={options.simulation.max_velocity} step={0.01} min={0.01} max={10}
                       onChange={e => setOptions({...options, ...{simulation: {max_velocity: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="max_velocity_increment">Max Velocity Increment</label>
                <input id="max_velocity_increment" type="number" value={options.simulation.max_velocity_change} step={0.01} min={0.01} max={10}
                       onChange={e => setOptions({...options, ...{simulation: {max_velocity_change: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="velocity_friction">Velocity Friction</label>
                <input id="velocity_friction" type="number" value={options.simulation.velocity_friction} step={0.001} min={0.001} max={0.5}
                       onChange={e => setOptions({...options, ...{simulation: {velocity_friction: parseFloat(e.target.value)}}})}
                />
                <br/>
                <label htmlFor="rebound">Rebound</label>
                <input id="rebound" type="number" value={options.simulation.velocity_rebound} step={0.01} min={0.01} max={10}
                       onChange={e => setOptions({...options, ...{simulation: {velocity_rebound: parseFloat(e.target.value)}}})}
                />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <div className={"menu"}>
                <div className={"button"} onClick={() => setOpen(!open)}>☰</div>
                {open && renderOptionMenu()}
            </div>
            <ReactWrapper options={options} />
        </React.Fragment>
    );
}
