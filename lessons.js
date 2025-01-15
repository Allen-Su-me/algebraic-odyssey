const LAYOUT={
    title: '',
    xaxis: { 
        title: 'X Position', 
        gridcolor: '#fff',
        range: [-1, 5],
        dtick: 1,
        showline: true,
        color: '#fff',
    },
    yaxis: { 
        title: 'Y Position', 
        gridcolor: '#fff',
        range: [-1, 5],
        dtick: 1,
        showline: true,
        color: '#fff',
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#fff' , size: 14 },
    template: 'plotly_dark',
    width: 300,
    height: 300
};
const LESSONS = {
    "Introduction to the Coordinate Plane": {
        name: "Introduction to the Coordinate Plane",
        title: "Navigation in Deep Space",
        mission: "Your spacecraft needs to navigate through an asteroid field. To avoid collisions, you must understand your position in space using a coordinate system.",
        concept: "In space navigation, we use a coordinate system similar to a map. The x-axis represents horizontal position, and the y-axis represents vertical position. Each point is represented by coordinates (x, y). This helps us calculate exact distances and plan safe routes.",
        problem: {
            question: "In deep space navigation, we've detected an asteroid and our base station. Write these coordinates in order - first the asteroid, then the base station - using the format (x,y),(x,y).",
            answer: ["(3,2),(2,0)", "(2,0),(3,2)"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace1 = {
                    x: [3],
                    y: [2],
                    mode: 'markers',
                    name: 'Asteroid',
                    marker: {
                        size: 12,
                        color: 'blue'
                    }
                };
                const trace2 = {
                    x: [2],
                    y: [0],
                    mode: 'markers',
                    name: 'Base',
                    marker: {
                        size: 12,
                        color: 'red'
                    }
                };
                var layout = LAYOUT;
                layout.title = 'Space Navigation Map';
                plot.newPlot('plotArea', [trace1, trace2], layout);
            }
        }
    },
    "Slope between Two Points": {
        name: "Slope between Two Points",
        title: "Calculating Interstellar Trajectories",
        mission: "Your spaceship needs to travel between two space stations. Calculate the slope of the trajectory to ensure a smooth journey.",
        concept: "Imagine drawing a line between two stars. The slope tells us how steep that line is. In space, this helps us understand the angle of our travel path. A larger slope means a steeper climb or descent. We calculate slope by dividing the change in the vertical position (rise) by the change in the horizontal position (run). The formula is: Slope = (y₂ - y₁) / (x₂ - x₁).",
        problem: {
            question: "Two space stations are located at coordinates (1, 1) and (3, 5). What is the slope of the trajectory between them?",
            answer: ["2", "2.0"], 
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [1, 3],
                    y: [1, 5],
                    mode: 'lines+markers',
                    name: 'Trajectory',
                    marker: { size: 12, color: 'lime' }
                };
                var layout = LAYOUT;
                layout.title = 'Interstellar Path';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Distance between Two Points": {
        name: "Distance between Two Points",
        title: "Measuring Distances Across the Cosmos",
        mission: "You need to calculate the distance between a satellite and your spaceship to initiate a repair mission.",
        concept: "To reach a distant object in space, we need to know exactly how far away it is. The distance formula helps us find the straight-line distance between two points using their coordinates. Think of it like finding the length of a rope stretched between two floating space rocks. The formula is: Distance = √[(x₂ - x₁)² + (y₂ - y₁)²]",
        problem: {
            question: "Your spaceship is at coordinates (0, 0), and a malfunctioning satellite is at coordinates (4, 3). What is the distance to the satellite?",
            answer: ["5", "5.0"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [0, 4],
                    y: [0, 3],
                    mode: 'lines+markers',
                    name: 'Distance',
                    marker: { size: 12, color: 'yellow' }
                };
                var layout = LAYOUT;
                layout.title = 'Cosmic Distance';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Slope of a Line": {
        name: "Slope of a Line",
        title: "Understanding Spacecraft Ascent Angles",
        mission: "Launching a rocket requires a precise ascent angle. This angle is determined by the slope of its path.",
        concept: "The slope of a line tells us how steep it is and in what direction it's going. Imagine a rocket launching – a higher slope means a steeper climb. We can find the slope using any two points on the line with the formula: Slope (m) = (change in y) / (change in x). A positive slope means the line goes up as you move to the right, and a negative slope means it goes down.",
        problem: {
            question: "A rocket's path passes through the points (0, 1) and (2, 5). What is the slope of the rocket's ascent?",
            answer: ["2", "2.0"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [0, 2],
                    y: [1, 5],
                    mode: 'lines+markers',
                    name: 'Rocket Path',
                    marker: { size: 12, color: 'orange' }
                };
                var layout = LAYOUT;
                layout.title = 'Rocket Ascent';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Equation of a Line": {
        name: "Equation of a Line",
        title: "Plotting Your Course Through Space",
        mission: "To stay on course, your spaceship's navigation system uses equations to define its path.",
        concept: "Think of the equation of a line as a set of instructions that tell us exactly where the line is located on our space map. One common way to write the equation is in 'slope-intercept form': y = mx + b. Here, 'm' is the slope (how steep the line is), and 'b' is the y-intercept (where the line crosses the vertical axis).",
        problem: {
            question: "A spaceship's planned trajectory has a slope of 2 and crosses the y-axis at the point (0, 1). What is the equation of its path in slope-intercept form (y = mx + b)?",
            answer: ["y=2x+1", "y = 2x + 1"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [-1, 3],
                    y: [-1, 7],
                    mode: 'lines',
                    name: 'Spacecraft Trajectory',
                    line: { color: 'cyan' }
                };
                var layout = LAYOUT;
                layout.title = 'Course Plot';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Graphing Lines": {
        name: "Graphing Lines",
        title: "Visualizing Space Travel Paths",
        mission: "You need to visualize different possible routes to a distant planet by graphing their equations.",
        concept: "Graphing a line is like drawing a map of a potential space route. To graph a line from its equation, we can find at least two points that lie on the line. One easy way is to pick a value for 'x', plug it into the equation, and solve for 'y'. Then plot these (x, y) points and connect them with a straight line.",
        problem: {
            question: "Graph the path of a probe defined by the equation y = -x + 4. What are the coordinates of two points the probe will pass through?",
            answer: ["(0,4),(4,0)", "(4,0),(0,4)"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [-1, 5],
                    y: [5, -1],
                    mode: 'lines+markers',
                    name: 'Probe Path',
                    marker: { size: 8, color: 'magenta' }
                };
                var layout = LAYOUT;
                layout.title = 'Visualizing Routes';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Elimination Method": {
        name: "Elimination Method",
        title: "Pinpointing Intercept Points of Space Objects",
        mission: "Two probes are following paths that will intersect. Use the elimination method to find the exact point of intersection.",
        concept: "Sometimes, we have two equations that describe the paths of objects in space. The elimination method helps us find where these paths cross. We do this by adding or subtracting the equations in a way that eliminates one of the variables (either 'x' or 'y'). Once we find the value of one variable, we can plug it back into either equation to find the other.",
        problem: {
            question: "The paths of two probes are described by the equations: x + y = 5 and x - y = 1. Use the elimination method to find the coordinates of their meeting point.",
            answer: ["(3,2)"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace1 = {
                    x: [0, 5],
                    y: [5, 0],
                    mode: 'lines',
                    name: 'Probe A',
                    line: { color: 'lightblue' }
                };
                const trace2 = {
                    x: [0, 5],
                    y: [-1, 4],
                    mode: 'lines',
                    name: 'Probe B',
                    line: { color: 'lightcoral' }
                };
                const intersection = {
                    x: [3],
                    y: [2],
                    mode: 'markers',
                    name: 'Intersection',
                    marker: { size: 10, color: 'white' }
                };
                var layout = LAYOUT;
                layout.title = 'Intercept Point';
                plot.newPlot('plotArea', [trace1, trace2, intersection], layout);
            }
        }
    },
    "Graphing Method": {
        name: "Graphing Method",
        title: "Visualizing Intersections in Orbit",
        mission: "You need to determine if two satellites' orbits will intersect and, if so, where, by graphing their orbital paths.",
        concept: "The graphing method is a visual way to solve systems of equations. Each equation represents a line (or curve in more complex cases). By plotting both lines on the same coordinate plane, the point where they cross is the solution to the system – the point where both conditions are true.",
        problem: {
            question: "Graph the following system of equations to find their solution: y = x + 1 and y = -x + 3. What are the coordinates of the intersection?",
            answer: ["(1,2)"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace1 = {
                    x: [-1, 3],
                    y: [0, 4],
                    mode: 'lines',
                    name: 'Satellite Orbit 1',
                    line: { color: 'lightgreen' }
                };
                const trace2 = {
                    x: [-1, 3],
                    y: [4, 0],
                    mode: 'lines',
                    name: 'Satellite Orbit 2',
                    line: { color: 'lightsalmon' }
                };
                const intersection = {
                    x: [1],
                    y: [2],
                    mode: 'markers',
                    name: 'Intersection',
                    marker: { size: 10, color: 'white' }
                };
                var layout = LAYOUT;
                layout.title = 'Orbital Intersection';
                plot.newPlot('plotArea', [trace1, trace2, intersection], layout);
            }
        }
    },
    "Solutions to Systems of Linear Equations": {
        name: "Solutions to Systems of Linear Equations",
        title: "Analyzing Space Traffic Control Scenarios",
        mission: "Air traffic control in space involves understanding whether spacecraft paths intersect, are parallel, or are the same to prevent collisions.",
        concept: "When we have two linear equations (representing paths in space, for example), there are three possibilities for their solutions: 1) One solution: The paths intersect at a single point. 2) No solution: The paths are parallel and never meet. 3) Infinite solutions: The paths are exactly the same, meaning the spacecraft are traveling along the same route.",
        problem: {
            question: "Analyze the following system of equations: y = 2x + 1 and y = 2x + 3. How many solutions does it have?",
            answer: ["0"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace1 = {
                    x: [-1, 3],
                    y: [-1, 7],
                    mode: 'lines',
                    name: 'Spacecraft A',
                    line: { color: 'gold' }
                };
                const trace2 = {
                    x: [-1, 3],
                    y: [1, 9],
                    mode: 'lines',
                    name: 'Spacecraft B',
                    line: { color: 'silver' }
                };
                var layout = LAYOUT;
                layout.title = 'Space Traffic Analysis';
                plot.newPlot('plotArea', [trace1, trace2], layout);
            }
        }
    },
    "Understanding Inequalities": {
        name: "Understanding Inequalities",
        title: "Defining Safe Zones in Space",
        mission: "Identify the safe zone for landing on a planet, which is defined by certain boundary conditions represented by inequalities.",
        concept: "Inequalities are like equations, but instead of an equals sign, they use symbols like > (greater than), < (less than), ≥ (greater than or equal to), or ≤ (less than or equal to). They help us define regions or ranges of values. For instance, if we need to stay above a certain altitude, that can be represented by an inequality.",
        problem: {
            question: "A safe landing zone on a planet requires the x-coordinate to be greater than 1. Write this condition as an inequality.",
            answer: ["x>1", "x > 1"],
            tolerance: 0,
            plotFunction: (plot) => {
                // Parameters for the line: y = mx + c
                const m = 2; // slope
                const c = 3; // y-intercept
                const sign = '<'; // Inequality sign ('>', '<', '>=', '<=')
                const xRange = [-3, 5]; // x-range for the line
                const yRange = [-1, 5]; // y-range for the visualization
            
                // Calculate y values for the line
                const yValue = xRange.map(x => m * x + c);
            
                // Define the shaded region based on the inequality sign
                let xFill, yFill, fillColor, inequalityLabel = `y ${sign} ${m}x ${c>=0?'+':'-'} ${Math.abs(c)}`;
            
                if (sign === '>') {
                    // Region above the line
                    xFill = [...xRange, xRange[1], xRange[0]]; // Close the polygon
                    yFill = [...yValue, yRange[1], yRange[1]]; // Extend above the line
                    fillColor = 'rgba(0, 255, 0, 0.5)'; // Semi-transparent green
                    
                } else if (sign === '>=') {
                    // Region above or on the line
                    xFill = [...xRange, xRange[1], xRange[0]]; // Close the polygon
                    yFill = [...yValue, yRange[1], yRange[1]]; // Extend above the line
                    fillColor = 'rgba(0, 0, 255, 0.5)'; // Semi-transparent blue
                    
                } else if (sign === '<') {
                    // Region below the line
                    xFill = [...xRange, xRange[1], xRange[0]]; // Close the polygon
                    yFill = [...yValue, yRange[0], yRange[0]]; // Extend below the line
                    fillColor = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
                    
                } else if (sign === '<=') {
                    // Region below or on the line
                    xFill = [...xRange, xRange[1], xRange[0]]; // Close the polygon
                    yFill = [...yValue, yRange[0], yRange[0]]; // Extend below the line
                    fillColor = 'rgba(255, 165, 0, 0.5)'; // Semi-transparent orange
                    
                } else {
                    console.error("Invalid inequality sign. Use one of '>', '<', '>=', '<='.");
                    return;
                }
            
                // Create the boundary line trace
                const lineTrace = {
                    x: xRange,
                    y: yValue,
                    mode: 'lines',
                    line: { color: 'violet' },
                    name: `y = ${m}x ${c>=0?'+':'-'} ${Math.abs(c)}`,
                };
            
                // Define the fill trace for the half-plane
                const fillTrace = {
                    x: xFill,
                    y: yFill,
                    fill: 'toself',
                    fillcolor: fillColor,
                    line: { width: 0 },
                    name: inequalityLabel,
                };
                       
                var layout = LAYOUT;
                layout.title = `Half-Plane Representation: ${inequalityLabel}`;
                layout.xaxis.range = xRange;
                layout.yaxis.range = yRange;
                plot.newPlot('plotArea', [fillTrace, lineTrace], layout);
            }
        }
    },
    "Graphing Inequalities": {
        name: "Graphing Inequalities",
        title: "Visualizing Space Boundaries",
        mission: "Visualize the region of space where a spacecraft can safely operate, given constraints on its position defined by an inequality.",
        concept: "Graphing inequalities helps us see all the possible locations that satisfy a certain condition. For example, if a spacecraft needs to stay above a certain line, we can graph that inequality. We first graph the boundary line (as if it were an equation). Then, we shade the region that satisfies the inequality. If the inequality includes 'greater than' or 'less than', the boundary line is dashed to show it's not included.",
        problem: {
            question: "Graph the inequality y > x. Which region represents the solutions?",
            answer: ["above"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [-1, 5],
                    y: [-1, 5],
                    mode: 'lines',
                    name: 'Boundary y = x',
                    line: { color: 'violet', dash: 'dash' }
                };
                var layout = LAYOUT;
                layout.title = 'Operational Boundaries';
                plot.newPlot('plotArea', [trace], layout);
            }
        }
    },
    "Real-World Application - Linear Programming": {
        name: "Real-World Application - Linear Programming",
        title: "Optimizing Resource Allocation for a Space Mission",
        mission: "You need to optimize the allocation of fuel and supplies for a long-duration space mission within given constraints.",
        concept: "Linear programming is like finding the best way to do something when you have limits. Imagine you have a certain amount of fuel and oxygen for a space trip, and you want to maximize the time you can spend exploring. Linear programming uses inequalities to represent these limits and helps find the best solution.",
        problem: {
            question: "A space mission needs at least 2 units of fuel (f) and 1 unit of oxygen (o) to operate safely. Write the inequalities representing these constraints.",
            answer: ["f>=2,o>=1"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace1 = {
                    x: [2, 2],
                    y: [-1, 5],
                    mode: 'lines',
                    name: 'Fuel Limit',
                    line: { color: 'coral', dash: 'dash' }
                };
                const trace2 = {
                    x: [-1, 5],
                    y: [1, 1],
                    mode: 'lines',
                    name: 'Oxygen Limit',
                    line: { color: 'deepskyblue', dash: 'dash' }
                };
                var layout = LAYOUT;
                layout.title = 'Resource Constraints';
                plot.newPlot('plotArea', [trace1, trace2], layout);
            }
        }
    }
};
