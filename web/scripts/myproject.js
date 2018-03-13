/* 
 Created on : Jan 26, 2018, 10:13:19 PM
 Author     : ahmedhelal
 */
$(document).ready(function ()
{
    //select the board to draw cells on it
    var boardElement = $("#board");
    var num = 1;//start id number
    var size;//size of the board
    var gameiterations = [];//to store every state of the game
    makeBoard(20);//make default board
    var time = 100;//the default delay time of the game 
    var playGame;//to stop set interval function
    var iteration = -1;//this avlue for iteration initially means no iterations yet
    var playing;//flag to know if the game started of not ... initally not started
    var pause;//flag to know if the game paused or not 

    //to play the game
    function play()
    {
        var neighbourhood = [];//to sotre the neighbourhood
        var activeCell = new Array();//to store the active cell id after the current iteration end
        var inactiveCell = new Array();//to store the inactive cell id after the current iteration end
        var myElement;//the cell which i refer to  . . . this will traverse the whole board
        for (var i = 1; i <= size * size; i++)
        {
            var countActiveNeighbourhood = 0;//for every element this must be zero to count for it
            //i = 22;//just try to be sure what i did is right
            myElement = $("#" + i);//22
            var next = i + 1;
            //console.log(next);//...23
            neighbourhood.push(next);//next
            var prev = i - 1;
            //console.log(prev);//...21
            neighbourhood.push(prev);//prev
            var top = i - size;
            //console.log(top);
            neighbourhood.push(top);//top
            var topLeft = i - size - 1;//..2
            //console.log(topLeft);
            neighbourhood.push(topLeft);//topLeft
            var topRight = i - size + 1;//..2
            //console.log(topRight);
            neighbourhood.push(topRight);//topRight
            var bottom = i + size;//..42
            //console.log(bottom);
            neighbourhood.push(bottom);//bottom
            var bottomLeft = i + size - 1;//..41
            //console.log(bottomLeft);
            neighbourhood.push(bottomLeft);//bottomLeft
            var bottomRight = i + size + 1;//..43
            //console.log(bottomRight);
            neighbourhood.push(bottomRight);//bottomRight
            //console.log(neighbourhood);

            //to count the number of active neighbourhood
            for (var j = 1; j <= 8; j++)
            {
                var n = neighbourhood.pop();
                if (n > 0)
                {
                    if ($("#" + n).hasClass("active"))
                    {
                        countActiveNeighbourhood++;
                    }
                }
            }

            //the rules of the game 
//            1- Any active tile with less than 2 active neighbors 
//            will become inactive in the next iteration
            if (myElement.hasClass("active") && countActiveNeighbourhood < 2)
            {
                inactiveCell.push(i);
                //myElement.removeClass("active").css("background-color", "grey");
            }

//            2- Any active tile with exactly 2 or 3 active neighbors 
//            will stay active in the next iteration
            if (myElement.hasClass("active") &&
                    (countActiveNeighbourhood == 2 || countActiveNeighbourhood == 3))
            {
                activeCell.push(i);
                //will stay active
            }

//            3- Any active tile with more than 3 active neighbors 
//            will become inactive in the next iteration
            if (myElement.hasClass("active") && countActiveNeighbourhood > 3)
            {
                inactiveCell.push(i);
                //myElement.removeClass("active").css("background-color", "grey");
            }

//            4- Any inactive tile with exactly 3 active neighbors 
//            will become active in the next iteration
            if ((!myElement.hasClass("active")) && countActiveNeighbourhood == 3)
            {
                activeCell.push(i);
                //myElement.addClass("active").css("background-color", "blue");
            }
        }
        //console.log(activeCell);
        //console.log(inactiveCell);
        var n = inactiveCell.length;//as the length affect by pop element
        for (var j = 0; j < n; j++)
        {
            $("#" + inactiveCell.pop()).removeClass("active").css("background-color", "grey");
        }
        var m = activeCell.length;//as the length affect by pop element
        for (var i = 0; i < m; i++)
        {
            $("#" + activeCell.pop()).addClass("active").css("background-color", "blue");
        }

//        if there is no change 
//        and the iteration is -1 
//        this means the user not press next or start button . .  n==0&&m==0&&iteration=-1
//        or press next with no active cell . .  n==0&&m==0&&iteration=0 !!!
        if (n == 0 && m == 0 && (iteration == -1 || iteration == 0))
        {
            iteration = -1;
            gameiterations.pop();//.......*
            //this will remove a photo of empty board 
        }
        else
        {
            //if the next iteration is different then store it
            if (gameiterations[iteration] != boardElement.html())
            {
                iteration++;
                gameiterations.push(boardElement.html());
            }
        }
        //if there is itertions then make the previous button enable
        if (iteration > 0 && pause)
        {
            $("#previous").removeAttr("disabled");
        }

        //boardElement.html();
        //boardElement.html(gameiterations[gameiterations.length]);
    }
    //the button start
    $("#start").on("click", function ()
    {
        playing = true;//to prevent event click on the cell of the board
        if ($(this).html() == "Start")
        {
            if (iteration == -1)
            {
                gameiterations.push(boardElement.html());
                //store the current board state
                iteration = 0;
            }
            $(this).html("Pause");
            pause = false;//to prevent delaytime from playing when the game is pause from play it
            $("#next").attr("disabled", "true");
            $("#previous").attr("disabled", "true");
            playGame = setInterval(play, time);
        }
        else if ($(this).html() == "Pause")
        {
            pause = true;//to prevent delaytime from playing when the game is pause from play it
            $(this).html("Start");
            clearInterval(playGame);
            $("#next").removeAttr("disabled");
            if (iteration > 0)
            {
                $("#previous").removeAttr("disabled");
            }
        }
    });
    //the button next
    $("#next").on("click", function ()
    {
        if (iteration == -1)
        {
            gameiterations.push(boardElement.html());
            //if the board is empty this will give empty board so i will delete it in *
            iteration = 0;
            //to prevent delaytime from playing when the game is pause from play it
            pause = true;//the game start from the next button
        }
        play();
    });
    //the button previous
    $("#previous").on("click", function ()
    {
        iteration--;
        if (iteration < 0)
        {
            $(this).attr("disabled", "true");

        }
        else
        {
            boardElement.html("");
            boardElement.html(gameiterations[iteration]);
        }

        if (!iteration)
        {
            $(this).attr("disabled", "true");
        }

    });
    //the button reset
    $("#reset").on("click", function ()
    {
        //to change the text in start button
        if ($("#start").html() == "Pause")
        {
            $("#start").trigger("click");
        }
        playing = false;//put the game in non playing state
        clearInterval(playGame);//stop set time interval
        iteration = -1;//make iteration at initial state
        $("#previous").attr("disabled", "true");//disable the prev button
        makeBoard(size);//draw the board according to the current size
        var l = gameiterations.length;//pop change the length of the array
        //to empty the array which store the iterations of the game 
        for (var i = 0; i <= l; i++)
        {
            gameiterations.pop();
        }
        //console.log(gameiterations);
    });
    //the button delay
    $("#delay").on("click", function ()
    {
        //stop the set interval to change it
        clearInterval(playGame);
        time = $(this).val();
        //if there is no pause then continue the timer 
        if (!pause)
        {
            playGame = setInterval(play, time);
        }
    });
    //handle size of the borad
    $("#boardsize").on("change", function ()
    {
        $("#reset").trigger("click");
        makeBoard($(this).val());
    });
    //to make the board
    function makeBoard(pSize)
    {
        size = pSize;
        //this will be the id for any cell 
        num = 1;
        boardElement.html("");//make div board empty
        for (var i = 1; i <= pSize; i++)
        {
            var rowElement = $("<div>");
            rowElement.attr("class", "row");
            for (var j = 1; j <= pSize; j++)
            {
                var cellElement = $("<div>");
                cellElement.attr("class", "cell");
                //make the cell inactive 
                cellElement.css("background-color", "grey");
                //i mark the cell my this id 
                cellElement.attr("id", num);
                num++;//every cell has unique id 
                rowElement.append(cellElement);
            }
            boardElement.append(rowElement);
        }
        //add action to the cell
        $(".cell").on("click", function ()
        {
            //if the game is not started yet the user can fire this event
            if (!playing)
            {
                //the user can toggle the state of the cell at any time 
                if ($(this).hasClass("active"))
                {
                    $(this).css("background-color", "grey");
                    $(this).removeClass("active");
                }
                else
                {
                    $(this).css("background-color", "blue");
                    $(this).addClass("active");
                }
            }

        });
    }
});