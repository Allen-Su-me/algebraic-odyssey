const LAYOUT={
    title: {
        text: '',
        standoff: 0,
    },
    xaxis: { 
        title: {
            text: 'X Position',
            standoff: 10,
        },
        gridcolor: '#444',
        gridwidth: 2,
        zerolinecolor: '#fff',//axis
        zerolinewidth: 2,
        range: [-1, 5],      
        showline: true,//border line
        linecolor: '#444',
        linewidth: 2,
        dtick: 1,
        tickangle: 0, //upright
    },
    yaxis: { 
        title: {
            text: 'Y Position',
            standoff: 5,
        }, 
        gridcolor: '#444',
        gridwidth: 2,
        zerolinecolor: '#fff',
        zerolinewidth: 2,
        range: [-1, 5],       
        showline: true,
        linecolor: '#444',
        linewidth: 2,
        dtick: 1,
        tickangle: 0,
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#fff' , size: 14 },
    template: 'plotly_dark',
    width: 350,
    height: 350
};
function drawInequailty(name,m,c,sign,xRange,yRange){

    // Calculate y values for the line
    const yValue = xRange.map(x => m * x + c);

    // Define the shaded region based on the inequality sign
    let xFill, yFill, fillColor;

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

    // Define the fill trace for the half-plane
    const fillTrace = {
        x: xFill,
        y: yFill,
        fill: 'toself',
        fillcolor: fillColor,
        line: { width: 0 },
        name: name,         
    };
           
    return fillTrace;
}
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
                layout.title.text = 'Space Navigation Map';
                plot.newPlot('plotArea', [trace1, trace2], layout);
            }
        }
    },
    "Slope between Two Points": {
        name: "Slope between Two Points",
        title: "Calculating Interstellar Trajectories",
        mission: "Your spaceship needs to travel between two space stations. Calculate the slope of the trajectory to ensure a smooth journey.",
        concept: "Imagine drawing a line between two stars. The slope tells us how steep that line is. In space, this helps us understand the angle of our travel path. A larger slope means a steeper climb or descent. We calculate slope by dividing the change in the vertical position (rise) by the change in the horizontal position (run). The formula is: Slope = rise / run = (y₂ - y₁) / (x₂ - x₁).",
        problem: {
            question: "Two space stations are located at coordinates (1, 1) and (3, 5). What is the slope of the trajectory between them?",
            answer: ["2", "2.0"], 
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [1, 3],
                    y: [1, 5],
                    mode: 'lines',
                    name: 'Trajectory',
                    marker: { size: 12, color: 'lime' }
                };
                const trace1 = {
                    x: [1],
                    y: [1],
                    mode: 'markers',
                    name: 'Space station 1',
                    marker: {
                        size: 12,
                        color: 'magenta'
                    }
                };
                const trace2 = {
                    x: [3],
                    y: [5],
                    mode: 'markers',
                    name: 'Space station 2',
                    marker: {
                        size: 12,
                        color: 'steelblue'
                    }
                };               
                var layout = LAYOUT;
                layout.title.text = 'Interstellar Path';
                layout.width = 400;
                layout.yaxis.range = [-1, 6];
                plot.newPlot('plotArea', [trace,trace1,trace2], layout);
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
                    mode: 'lines',
                    name: 'Distance',
                    marker: { size: 12, color: 'yellow' }
                };
                const trace1 = {
                    x: [0],
                    y: [0],
                    mode: 'markers',
                    name: 'Spaceship',
                    marker: {
                        size: 12,
                        color: 'blue'
                    }
                };
                const trace2 = {
                    x: [4],
                    y: [3],
                    mode: 'markers',
                    name: 'Satellite',
                    marker: {
                        size: 12,
                        color: 'gray'
                    }
                };
                var layout = LAYOUT;
                layout.title.text = 'Cosmic Distance';
                plot.newPlot('plotArea', [trace,trace1,trace2], layout);
            }
        }
    },
    "Slope of a Line": {
        name: "Slope of a Line",
        title: "Spacecraft Flight Paths",
        mission: "Space pilots need to understand flight paths. The steepness of these paths is called slope!",
        concept: "Every spacecraft follows a straight path that can be written as y=mx+b. The 'm' in this formula is the slope - it tells us how steep the path is! Imagine you're a space pilot: if m=1, your ship goes up at a 45° angle. If m=2, it's steeper, going up twice as fast. Negative slopes mean you're heading down toward a planet. The bigger the number, the steeper your flight path!",
        problem: {
            question: "A spacecraft follows the path y=3x+1. What is the slope (m) of its flight path?",
            answer: ["3", "3.0"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [-1, 3],
                    y: [-2, 10],
                    mode: 'lines', 
                    name: 'Spacecraft Path',
                    line: { color: 'orange' },
                    showlegend: true //needed when there is only one trace
                };
                var layout = LAYOUT;
                layout.title.text = 'Spacecraft Flight Path';
                layout.width = 400;
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
                    line: { color: 'cyan' },
                    showlegend: true
                };
                var layout = LAYOUT;
                layout.title.text = 'Course Plot';
                layout.width = 450;
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
            question: "Graph the path of a probe defined by the equation y = -2x + 4. What are the coordinates of two points the probe will pass through, if we choose x = 0 and y = 0 respectively?",
            answer: ["(0,4),(2,0)", "(2,0),(0,4)"],
            tolerance: 0,
            plotFunction: (plot) => {
                const trace = {
                    x: [-1, 5],
                    y: [6, -6],
                    mode: 'lines',
                    name: 'Probe Path',
                    line: { color: 'magenta' },
                    showlegend: true
                };
                var layout = LAYOUT;
                layout.title.text = 'Visualizing Routes';
                layout.width = 400;
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
                    name: 'x + y = 5',
                    line: { color: 'lightblue' }
                };
                const trace2 = {
                    x: [0, 5],
                    y: [-1, 4],
                    mode: 'lines',
                    name: 'x - y = 1',
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
                layout.title.text = 'Intercept Point';
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
                    x: [-1, 5],
                    y: [0, 6],
                    mode: 'lines',
                    name: 'y = x + 1',
                    line: { color: 'lightgreen' }
                };
                const trace2 = {
                    x: [-1, 5],
                    y: [4, -2],
                    mode: 'lines',
                    name: 'y = -x + 3',
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
                layout.title.text = 'Orbital Intersection';
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
                    x: [-3, 3],
                    y: [-5, 7],
                    mode: 'lines',
                    name: 'y = 2x + 1',
                    line: { color: 'gold' }
                };
                const trace2 = {
                    x: [-3, 3],
                    y: [-3, 9],
                    mode: 'lines',
                    name: 'y = 2x + 3',
                    line: { color: 'silver' }
                };
                var layout = LAYOUT;
                layout.title.text = 'Space Traffic Analysis';
                plot.newPlot('plotArea', [trace1, trace2], layout);
            }
        }
    },
    "Understanding Inequalities": {
        name: "Understanding Inequalities",
        title: "Defining Safe Zones in Space",
        mission: "Identify the safe zone for flying on a planet, which is defined by certain boundary conditions represented by inequalities.",
        concept: "Inequalities are like equations, but instead of an equals sign, they use symbols like > (greater than), < (less than), ≥ (greater than or equal to), or ≤ (less than or equal to). They help us define regions or ranges of values. For instance, if we need to stay above a certain altitude, that can be represented by an inequality.",
        problem: {
            question: "If the safety flying zone on a planet cannot be lower than 1 unit of altitude, write this as an inequality.",
            answer: ["y>=1", "y >= 1"],
            tolerance: 0,
            plotFunction: (plot) => {
                // Parameters for the line: y = mx + c
                const m = 0; // slope
                const c = 1; // y-intercept
                const sign = '>='; // Inequality sign ('>', '<', '>=', '<=')
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
                    line: { color: 'cyan' },
                    name: 'Boundary Line',
                    //name: `y = ${m}x ${c>=0?'+':'-'} ${Math.abs(c)}`,
                };
            
                // Define the fill trace for the half-plane
                const fillTrace = {
                    x: xFill,
                    y: yFill,
                    fill: 'toself',
                    fillcolor: fillColor,
                    line: { width: 0 },
                    name: 'Safe Zone', //name: inequalityLabel,
                    
                };
                       
                var layout = LAYOUT;
                layout.title.text = 'Safe Flying Zone on Planet';
                layout.xaxis.range = xRange;
                layout.yaxis.range = yRange;
                layout.width = 400;
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
            question: "Assuming a spacecraft can only safely operate in the region y > x - 1. Which region represents the safe landing zone?",
            answer: ["A","Region A"],
            tolerance: 0,
            plotFunction: (plot) => {
                
                const m = 1; 
                const c = -1; 
                
                const xRange = [-3, 5]; 
                const yRange = [-1, 5]; 
            
                const regionA = drawInequailty('Region A',m,c,'>=',xRange,yRange);
                const regionB = drawInequailty('Region B',m,c,'<=',xRange,yRange);
                const trace = {
                    x: [-3, 5],
                    y: [-4, 4],
                    mode: 'lines',
                    name: 'Boundary y = x - 1',
                    line: { color: 'cyan', dash: 'dash' }
                };

                var layout = LAYOUT;
                layout.title.text = 'Safe Landing Zone on Planet';
                layout.xaxis.range = xRange;
                layout.yaxis.range = yRange;
                layout.width = 450;
                plot.newPlot('plotArea', [regionA,regionB,trace], layout);
            }
        }
    },
    "Real-World Application - Linear Programming": {
        name: "Real-World Application - Linear Programming",
        title: "Optimizing Resource Allocation for a Space Mission",
        mission: "You need to optimize the allocation of fuel (f) and oxygen (o) for a long-duration space mission within given constraints.",
        concept: "Linear programming helps find the optimal solution when we have multiple constraints. In space missions, we often need to balance different resources. These constraints form a feasible region - the area where all constraints are satisfied. The optimal solution usually lies at one of the corners of this region.",
        problem: {
            question: "Given the constraints: 2f + o ≥ 3, f + 2o ≤ 8, and f ≥ 0, o ≥ 0, which point (f,o) in the feasible region gives the minimum total resources (f + o)?",
            answer: ["(1.5,0)", "(3/2,0)"],
            tolerance: 0,
            plotFunction: (plot) => {
                // First constraint: 2f + o ≥ 3
                const fillTrace1 = drawInequailty(
                    '2f + o ≥ 3',
                    -2, // slope
                    3,  // intercept
                    '>',
                    [0, 5],
                    [0, 5]
                );

                // Second constraint: f + 2o ≤ 8
                const fillTrace2 = drawInequailty(
                    'f + 2o ≤ 8',
                    -0.5, // slope (-1/2)
                    4,    // intercept
                    '<=',
                    [0, 5],
                    [0, 5]
                );

                const trace1 = {
                    x: [0, 5],
                    y: [3, -7],
                    mode: 'lines',
                    name: '2f + o = 3',
                    line: { color: 'cyan' }
                };

                const trace2 = {
                    x: [0, 5],
                    y: [4, 1.5],
                    mode: 'lines',
                    name: 'f + 2o = 8',
                    line: { color: 'violet' }
                };

                const optimalPoint = {
                    x: [1.5],
                    y: [0],
                    mode: 'markers',
                    name: 'Optimal Point',
                    marker: {
                        size: 10,
                        color: 'white'
                    }
                };

                var layout = LAYOUT;
                layout.title.text = 'Resource Optimization';
                layout.width = 450;
                layout.xaxis.range = [0, 5];
                layout.yaxis.range = [0, 5];
                layout.xaxis.title.text = 'Fuel (f)';
                layout.yaxis.title.text = 'Oxygen (o)';
                plot.newPlot('plotArea', [fillTrace1, fillTrace2, trace1, trace2, optimalPoint], layout);
            }
        }
    }
};
