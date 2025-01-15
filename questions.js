const QUESTIONS = {
    "Introduction to the Coordinate Plane": [
        {
            text: "The coordinate of a point is (3, 4). What is the y coordinate of the point?",
            answer: "4",
            options: ["3", "4", "0", "1", "-1"],
        },
        {
            text: "The coordinate of a point is (-2, 5). What is the x coordinate of the point?",
            answer: "-2",
            options: ["-2", "5", "0", "1", "-1"],
        },
        {
            text: "A point is located at (-2, 3). How far is it from the origin (0, 0) in the rightward (horizontal) direction?",
            answer: "2",
            options: ["0", "2", "3", "1", "-1"],
        },
        {
            text: "In the coordinate pair (x, y), which value represents the horizontal position?",
            answer: "x",
            options: ["x", "y", "0", "Neither", "Both"],
        },
        {
            text: "If a point lies on the x-axis, what is its y-coordinate?",
            answer: "0",
            options: ["1", "-1", "0", "Any number", "It depends on the x-coordinate"],
        },
        {
            text: "If a point lies on the y-axis, what is its x-coordinate?",
            answer: "0",
            options: ["1", "-1", "0", "Any number", "It depends on the y-coordinate"],
        },
        {
            text: "What is the origin in the coordinate plane?",
            answer: "(0, 0)",
            options: ["(1, 1)", "(0, 0)", "(1, 0)", "(0, 1)", "It depends on the graph"],
        }
    ],
    "Slope between Two Points": [
        {
            text: "What is the formula for the slope (m) between two points (x1, y1) and (x2, y2)?",
            answer: "(y2 - y1) / (x2 - x1)",
            options: ["(y2 - y1) / (x2 - x1)", "(x2 - x1) / (y2 - y1)", "(y1 - y2) / (x2 - x1)", "(x1 - x2) / (y1 - y2)", "(x1 + x2) / (y1 + y2)"],
        },
        {
            text: "What is the slope between the points (1, 2) and (3, 4)?",
            answer: "1",
            options: ["0", "1", "-1", "2", "3"],
        },
        {
            text: "What is the slope between the points (0, 0) and (2, 4)?",
            answer: "2",
            options: ["0", "1", "2", "4", "-2"],
        },
        {
            text: "What is the slope between the points (5, 2) and (5, 7)?",
            answer: "Undefined",
            options: ["0", "1", "5", "Undefined", "-1"],
        },
        {
            text: "What is the slope between the points (1, 5) and (3, 5)?",
            answer: "0",
            options: ["0", "1", "5", "Undefined", "-1"],
        },
        {
            text: "A line that goes upwards from left to right has a ___ slope.",
            answer: "positive",
            options: ["positive", "negative", "zero", "undefined", "cannot be determined"],
        },
        {
            text: "A line that goes downwards from left to right has a ___ slope.",
            answer: "negative",
            options: ["positive", "negative", "zero", "undefined", "cannot be determined"],
        },
        {
            text: "What is the slope between the points (-1, 3) and (2, -3)?",
            answer: "-2",
            options: ["2", "-2", "0", "1", "-1"],
        }
    ],
    "Distance between Two Points": [
        {
            text: "What is the formula for the distance between two points (x1, y1) and (x2, y2)?",
            answer: "√((x2 - x1)² + (y2 - y1)²) ",
            options: ["√((x2 - x1)² + (y2 - y1)²) ", "((x2 - x1)² + (y2 - y1)²) ", "|x2 - x1| + |y2 - y1|", "√((x2 + x1)² + (y2 + y1)²) ", "(x2 - x1) + (y2 - y1)"],
        },
        {
            text: "What is the distance between the points (0, 0) and (3, 4)?",
            answer: "5",
            options: ["5", "7", "25", "12", "1"],
        },
        {
            text: "What is the distance between the points (1, 0) and (4, 0)?",
            answer: "3",
            options: ["3", "4", "5", "0", "1"],
        },
        {
            text: "What is the distance between the points (0, 2) and (0, 5)?",
            answer: "3",
            options: ["3", "5", "7", "0", "2"],
        },
        {
            text: "What is the distance between the points (-1, 0) and (1, 0)?",
            answer: "2",
            options: ["0", "1", "2", "-1", "-2"],
        },
        {
            text: "The distance between two points is always a ___ value.",
            answer: "non-negative",
            options: ["positive", "negative", "zero", "non-negative", "any real number"],
        },
        {
            text: "What is the distance between the points (-2, 1) and (1, 5)?",
            answer: "5",
            options: ["3", "4", "5", "6", "7"],
        },
        {
            text: "What is the distance between the points (-3, -4) and (0, 0)?",
            answer: "5",
            options: ["3", "4", "5", "7", "12"],
        }
    ],
    "Slope of a Line": [
        {
            text: "What does the slope of a line represent?",
            answer: "Steepness and direction",
            options: ["Length of the line", "Steepness and direction", "Midpoint of the line", "Area under the line", "Y-intercept"],
        },
        {
            text: "A horizontal line has a slope of...",
            answer: "0",
            options: ["Positive", "Negative", "0", "Undefined", "1"],
        },
        {
            text: "A vertical line has a slope that is...",
            answer: "Undefined",
            options: ["Positive", "Negative", "0", "Undefined", "-1"],
        },
        {
            text: "If two lines are parallel, their slopes are...",
            answer: "Equal",
            options: ["Equal", "Opposite", "Negative reciprocals", "Multiplied to -1", "Different"],
        },
        {
            text: "If two lines are perpendicular, the product of their slopes is...",
            answer: "-1",
            options: ["1", "-1", "0", "Undefined", "Equal"],
        },
        {
            text: "A line with a slope of 3 is steeper than a line with a slope of...",
            answer: "2",
            options: ["4", "5", "3", "2", "Any positive number"],
        },
        {
            text: "What is the slope of the line y = 2x + 5?",
            answer: "2",
            options: ["2", "5", "-2", "-5", "7"],
        },
        {
            text: "What is the slope of the line y = -x + 3?",
            answer: "-1",
            options: ["1", "-1", "3", "-3", "0"],
        }
    ],
    "Equation of a Line": [
        {
            text: "Which of the following is the slope-intercept form of a linear equation?",
            answer: "y = mx + b",
            options: ["y = mx + b", "Ax + By = C", "y - y1 = m(x - x1)", "y = c", "x = c"],
        },
        {
            text: "In the equation y = mx + b, what does 'b' represent?",
            answer: "y-intercept",
            options: ["slope", "y-intercept", "x-intercept", "a point on the line", "the origin"],
        },
        {
            text: "What is the y-intercept of the line y = 3x - 2?",
            answer: "-2",
            options: ["3", "-2", "0", "1", "-3"],
        },
        {
            text: "What is the equation of a horizontal line passing through the point (2, 5)?",
            answer: "y = 5",
            options: ["x = 2", "y = 5", "y = x + 3", "y = 0", "x = 0"],
        },
        {
            text: "What is the equation of a vertical line passing through the point (-1, 3)?",
            answer: "x = -1",
            options: ["y = 3", "x = -1", "y = -x + 2", "y = 0", "x = 0"],
        },
        {
            text: "A line has a slope of 2 and passes through the point (0, 4). What is its equation?",
            answer: "y = 2x + 4",
            options: ["y = 2x + 4", "y = 4x + 2", "y = 2x", "y = 4x", "y = 2x - 4"],
        },
        {
            text: "A line passes through points (1, 2) and has a slope of 3. What is its equation?",
            answer: "y = 3x - 1",
            options: ["y = 3x - 1", "y = 3x + 1", "y = 2x + 1", "y = x + 2", "y = 3x"],
        },
        {
            text: "Which of the following lines has a y-intercept of 7?",
            answer: "y = 2x + 7",
            options: ["y = 2x + 7", "y = 7x + 2", "y = 7x", "y = 2x - 7", "x = 7"],
        }
    ],
    "Graphing Lines": [
        {
            text: "To graph a line using slope-intercept form, which two pieces of information do you need?",
            answer: "Slope and y-intercept",
            options: ["Two points", "Slope and y-intercept", "X and y-intercepts", "Slope and x-intercept", "The origin and slope"],
        },
        {
            text: "What is the first step in graphing the line y = -2x + 3?",
            answer: "Plot the y-intercept at (0, 3)",
            options: ["Plot the point (1, -2)", "Plot the y-intercept at (0, 3)", "Plot the x-intercept at (1.5, 0)", "Draw a line randomly", "Calculate the slope"],
        },
        {
            text: "If a line has a positive slope, it will go in which direction as you move from left to right?",
            answer: "Upwards",
            options: ["Upwards", "Downwards", "Horizontal", "Vertical", "Cannot be determined"],
        },
        {
            text: "If a line has a negative slope, it will go in which direction as you move from left to right?",
            answer: "Downwards",
            options: ["Upwards", "Downwards", "Horizontal", "Vertical", "Cannot be determined"],
        },
        {
            text: "The x-intercept is the point where the line crosses the...",
            answer: "x-axis",
            options: ["x-axis", "y-axis", "origin", "quadrant I", "quadrant III"],
        },
        {
            text: "The y-intercept is the point where the line crosses the...",
            answer: "y-axis",
            options: ["x-axis", "y-axis", "origin", "quadrant II", "quadrant IV"],
        },
        {
            text: "Which point is on the graph of the line y = x + 1?",
            answer: "(1, 2)",
            options: ["(1, 2)", "(2, 1)", "(0, 0)", "(1, 0)", "(0, 1)"],
        },
        {
            text: "Which point is NOT on the graph of the line y = 2x - 1?",
            answer: "(1, 2)",
            options: ["(1, 1)", "(2, 3)", "(0, -1)", "(3, 5)", "(1, 2)"],
        }
    ],
    "Elimination Method": [
        {
            text: "What is the main goal of the elimination method for solving systems of equations?",
            answer: "Eliminate one variable",
            options: ["Isolate one variable", "Eliminate one variable", "Substitute values", "Graph the equations", "Find the slope"],
        },
        {
            text: "Consider the system: x + y = 5, x - y = 1. What happens when you add the two equations?",
            answer: "The y variable is eliminated",
            options: ["The x variable is eliminated", "The y variable is eliminated", "Both variables are eliminated", "You get 2x = 4", "You get 2y = 6"],
        },
        {
            text: "Consider the system: 2x + y = 7, x - y = 2. What is the value of x?",
            answer: "3",
            options: ["1", "2", "3", "4", "5"],
        },
        {
            text: "Consider the system: 3x + 2y = 8, 3x - y = 5. What operation can you perform to eliminate x?",
            answer: "Subtract the second equation from the first",
            options: ["Add the two equations", "Subtract the second equation from the first", "Multiply the equations", "Divide the equations", "Substitute"],
        },
        {
            text: "To eliminate a variable, the coefficients of that variable must be...",
            answer: "Opposites or the same",
            options: ["Equal", "Opposites or the same", "Both positive", "Both negative", "Prime numbers"],
        },
        {
            text: "Consider the system: x + 2y = 10, -x + y = 2. What is the value of y?",
            answer: "4",
            options: ["2", "3", "4", "5", "6"],
        },
        {
            text: "Consider the system: 2x + 3y = 11, x - y = 1. To make the x coefficients opposites, what should you multiply the second equation by?",
            answer: "-2",
            options: ["2", "-2", "3", "-3", "1"],
        },
        {
            text: "What is the solution (x, y) for the system: x + y = 6, x - y = 2?",
            answer: "(4, 2)",
            options: ["(2, 4)", "(4, 2)", "(3, 3)", "(5, 1)", "(1, 5)"],
        }
    ],
    "Graphing Method": [
        {
            text: "How do you solve a system of equations using the graphing method?",
            answer: "Find the point of intersection",
            options: ["Add the equations", "Subtract the equations", "Find the point of intersection", "Substitute values", "Eliminate a variable"],
        },
        {
            text: "What does the intersection point of two lines on a graph represent?",
            answer: "The solution to the system",
            options: ["The slopes of the lines", "The y-intercepts", "The x-intercepts", "The solution to the system", "Parallel lines"],
        },
        {
            text: "If two lines in a system are parallel, how many solutions are there?",
            answer: "Zero",
            options: ["One", "Two", "Infinitely many", "Zero", "It depends on the y-intercepts"],
        },
        {
            text: "If two lines in a system are the same line, how many solutions are there?",
            answer: "Infinitely many",
            options: ["One", "Two", "Infinitely many", "Zero", "It depends on the slope"],
        },
        {
            text: "To graph the equation y = 2x + 1, where does the line cross the y-axis?",
            answer: "At (0, 1)",
            options: ["At (1, 0)", "At (0, 1)", "At (2, 1)", "At (1, 2)", "At the origin"],
        },
        {
            text: "To graph the equation x + y = 3, what are the x and y intercepts?",
            answer: "x-intercept: (3, 0), y-intercept: (0, 3)",
            options: ["x-intercept: (3, 0), y-intercept: (0, 3)", "x-intercept: (0, 3), y-intercept: (3, 0)", "x-intercept: (1, 1), y-intercept: (1, 1)", "x-intercept: (-3, 0), y-intercept: (0, -3)", "x-intercept: (0, 0), y-intercept: (0, 0)"],
        },
        {
            text: "What is the solution to the system shown in the graph if the lines intersect at the point (2, 3)?",
            answer: "x = 2, y = 3",
            options: ["x = 3, y = 2", "x = 2, y = 3", "x = 5, y = 0", "x = 0, y = 5", "No solution"],
        },
        {
            text: "Which of the following describes a system of equations with no solution when graphed?",
            answer: "Parallel lines",
            options: ["Intersecting lines", "Coinciding lines", "Parallel lines", "Vertical lines", "Horizontal lines"],
        }
    ],
    "Solutions to Systems of Linear Equations": [
        {
            text: "A system of linear equations can have...",
            answer: "One, zero, or infinitely many solutions",
            options: ["Only one solution", "Only two solutions", "One, zero, or infinitely many solutions", "Only zero solutions", "Only infinitely many solutions"],
        },
        {
            text: "If a system of equations has exactly one solution, what does this mean about the lines when graphed?",
            answer: "They intersect at one point",
            options: ["They are parallel", "They are the same line", "They intersect at one point", "They are perpendicular", "They don't intersect"],
        },
        {
            text: "If a system of equations has infinitely many solutions, what does this mean about the lines when graphed?",
            answer: "They are the same line",
            options: ["They are parallel", "They are the same line", "They intersect at one point", "They are perpendicular", "They don't intersect"],
        },
        {
            text: "If a system of equations has no solution, what does this mean about the lines when graphed?",
            answer: "They are parallel",
            options: ["They are parallel", "They are the same line", "They intersect at one point", "They are perpendicular", "They intersect at multiple points"],
        },
        {
            text: "Which of the following is a solution to the system: x + y = 4, x - y = 2?",
            answer: "x = 3, y = 1",
            options: ["x = 1, y = 3", "x = 3, y = 1", "x = 2, y = 2", "x = 4, y = 0", "No solution"],
        },
        {
            text: "Which of the following systems of equations has no solution?",
            answer: "y = 2x + 1, y = 2x + 3",
            options: ["y = x + 1, y = 2x + 2", "y = 2x + 1, y = 2x + 3", "y = x + 1, y = x + 1", "y = 3x, y = -3x", "y = x, y = -x"],
        },
        {
            text: "Which of the following systems of equations has infinitely many solutions?",
            answer: "y = x + 2, 2y = 2x + 4",
            options: ["y = x + 2, y = x + 3", "y = x + 2, 2y = 2x + 4", "y = 2x, y = -2x", "y = 3, x = 4", "y = x, y = -x"],
        },
        {
            text: "What type of solution does the system x + y = 5 and 2x + 2y = 10 have?",
            answer: "Infinitely many solutions",
            options: ["One solution", "No solution", "Infinitely many solutions", "Two solutions", "Cannot be determined"],
        }
    ],
    "Understanding Inequalities": [
        {
            text: "Which symbol means 'less than'?",
            answer: "<",
            options: ["<", ">", "≤", "≥", "="],
        },
        {
            text: "Which symbol means 'greater than or equal to'?",
            answer: "≥",
            options: ["<", ">", "≤", "≥", "="],
        },
        {
            text: "What does the inequality x > 3 represent on a number line?",
            answer: "All numbers to the right of 3, not including 3",
            options: ["All numbers to the right of 3, including 3", "All numbers to the left of 3, including 3", "All numbers to the right of 3, not including 3", "All numbers to the left of 3, not including 3", "Only the number 3"],
        },
        {
            text: "What does the inequality y ≤ -2 represent on a number line?",
            answer: "All numbers to the left of -2, including -2",
            options: ["All numbers to the right of -2, including -2", "All numbers to the left of -2, including -2", "All numbers to the right of -2, not including -2", "All numbers to the left of -2, not including -2", "Only the number -2"],
        },
        {
            text: "Is 5 a solution to the inequality x < 4?",
            answer: "No",
            options: ["Yes", "No", "Maybe", "It depends", "Not enough information"],
        },
        {
            text: "Is -1 a solution to the inequality y ≥ -1?",
            answer: "Yes",
            options: ["Yes", "No", "Maybe", "It depends", "Not enough information"],
        },
        {
            text: "Which inequality represents 'a number is greater than 10'?",
            answer: "x > 10",
            options: ["x > 10", "x < 10", "x ≥ 10", "x ≤ 10", "x = 10"],
        },
        {
            text: "Which inequality represents 'a number is less than or equal to 5'?",
            answer: "x ≤ 5",
            options: ["x > 5", "x < 5", "x ≥ 5", "x ≤ 5", "x = 5"],
        }
    ],
    "Graphing Inequalities": [
        {
            text: "When graphing an inequality with '>' or '<', what type of line do you use?",
            answer: "Dashed line",
            options: ["Solid line", "Dashed line", "Wavy line", "Bold line", "Dottted line"],
        },
        {
            text: "When graphing an inequality with '≥' or '≤', what type of line do you use?",
            answer: "Solid line",
            options: ["Solid line", "Dashed line", "Wavy line", "Bold line", "Dottted line"],
        },
        {
            text: "To graph y > x, which region do you shade?",
            answer: "Above the line",
            options: ["Below the line", "Above the line", "On the line", "To the left of the line", "To the right of the line"],
        },
        {
            text: "To graph y ≤ -x + 2, which region do you shade?",
            answer: "Below the line",
            options: ["Below the line", "Above the line", "On the line", "To the left of the line", "To the right of the line"],
        },
        {
            text: "Which region represents the solution to the inequality x ≥ 3 on a coordinate plane?",
            answer: "The region to the right of the vertical line x = 3 (including the line)",
            options: ["The region to the left of the vertical line x = 3", "The region to the right of the vertical line x = 3 (including the line)", "The region above the horizontal line y = 3", "The region below the horizontal line y = 3", "Only the line x = 3"],
        },
        {
            text: "Which region represents the solution to the inequality y < 1 on a coordinate plane?",
            answer: "The region below the horizontal line y = 1 (excluding the line)",
            options: ["The region above the horizontal line y = 1", "The region below the horizontal line y = 1 (excluding the line)", "The region to the right of the vertical line y = 1", "The region to the left of the vertical line y = 1", "Only the line y = 1"],
        },
        {
            text: "Which point is a solution to the inequality y > x + 1?",
            answer: "(1, 3)",
            options: ["(1, 1)", "(0, 1)", "(1, 3)", "(2, 3)", "(0, 0)"],
        },
        {
            text: "Which point is NOT a solution to the inequality y ≤ 2x - 1?",
            answer: "(2, 4)",
            options: ["(0, -1)", "(1, 1)", "(2, 3)", "(3, 5)", "(2, 4)"],
        }
    ],
    "Real-World Application - Linear Programming": [
        {
            text: "What is the main goal of linear programming?",
            answer: "Optimize a function subject to constraints",
            options: ["Solve a system of equations", "Graph inequalities", "Optimize a function subject to constraints", "Find the slope of a line", "Calculate distance"],
        },
        {
            text: "In linear programming, constraints are represented by...",
            answer: "Inequalities",
            options: ["Equations", "Points", "Inequalities", "Lines", "Slopes"],
        },
        {
            text: "The feasible region in linear programming represents...",
            answer: "All possible solutions that satisfy the constraints",
            options: ["The point of intersection", "The area under the line", "All possible solutions that satisfy the constraints", "The slope of the lines", "The y-intercepts"],
        },
        {
            text: "The optimal solution in linear programming occurs at...",
            answer: "A corner point of the feasible region",
            options: ["The origin", "The midpoint of a line", "A corner point of the feasible region", "Any point within the feasible region", "Any point outside the feasible region"],
        },
        {
            text: "A bakery wants to maximize its profit from selling cakes and cookies. Which mathematical technique could help them determine the optimal number of each to bake?",
            answer: "Linear programming",
            options: ["Algebraic equations", "Graphing lines", "Linear programming", "Calculating slope", "Finding distances"],
        },
        {
            text: "A factory needs to minimize the cost of producing two types of products while meeting certain demand requirements. This scenario can be modeled using:",
            answer: "Linear programming",
            options: ["Systems of equations", "Graphing inequalities", "Linear programming", "Finding slope", "Calculating distance"],
        },
        {
            text: "What does the objective function in a linear programming problem represent?",
            answer: "The function to be maximized or minimized",
            options: ["The constraints", "The feasible region", "The function to be maximized or minimized", "The corner points", "The variables"],
        },
        {
            text: "What is a common application of linear programming in real-world scenarios?",
            answer: "Resource allocation",
            options: ["Finding the slope of a line", "Graphing points", "Resource allocation", "Calculating distance between points", "Solving single equations"],
        }
    ]
};