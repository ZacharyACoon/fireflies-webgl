import React from "react";
import Simulation from "./simulation";
import WebGlWrapper from "./renderer";


ReactWrapper.defaultProps = {
    options: {
        simulation: Simulation.getDefaultOptions(),
        renderer: WebGlWrapper.getDefaultOptions(),
    }
}

export default function ReactWrapper(props) {
    const ref= React.useRef();

    React.useLayoutEffect(() => {
        if(ref.current) {
            let {offsetWidth: width, offsetHeight: height} = ref.current;
            let depth = (width + height) / 2;

            let options = {
                simulation: {
                    ...Simulation.getDefaultOptions(),
                    ...props.options.simulation,
                    width: width,
                    height: height,
                    depth: depth,
                },
                render: {
                    ...WebGlWrapper.getDefaultOptions(),
                    ...props.options.render,
                },
            };

            if( !ref.current.fireflies ) {
                ref.current.fireflies = {}
                let context = ref.current.fireflies;

                let density = options.simulation.density;
                if( !options.simulation.count ) {
                    options.simulation.count = width * height * depth * density * density;
                }

                context.simulation = new Simulation(options.simulation);
                context.simulation.newRandomPopulation();
                context.renderer = new WebGlWrapper(ref.current, options.render);

                window.addEventListener("resize", () => {
                    let {offsetWidth: width, offsetHeight: height} = ref.current;
                    context.simulation.options.width = width;
                    context.simulation.options.height = height;
                    context.simulation.options.depth = (width * height) / 2;
                    context.renderer.updateDimensions();
                });

                function animate() {
                    context.simulation.nextFrame();
                    context.renderer.render(context.simulation);
                    requestAnimationFrame(animate);
                }
                animate();
            } else {
                let context = ref.current.fireflies;
                context.simulation.setOptions(options.simulation);
                context.renderer.setOptions(options.render);
            }
        }
    });

    return (
        <div
            ref={ref}
            style={{
                position: "absolute",
                top: 0, right: 0, bottom: 0, left: 0,
                overflow: "hidden",
            }}
        />
    )
}
