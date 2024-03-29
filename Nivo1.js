var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(30, 30, "black", 10, 120);   /*definisanje predmeta sirina, visina, boja, udaljenost od lijevog coska(100), odakle ce poceti predmet(120)*/
    myGamePiece.gravity = 0.05;								/*jacina gravitacije*/
    myScore = new component("30px", "Consolas", "white", 480, 40, "text");		/*definisanje rezultata*/
    myGameArea.start();										/*pozivanje funkcije mygamearea*/
}

var myGameArea = {
    canvas : document.createElement("canvas"),		/*pravi elemenat canvas*/
    start : function() {
        this.canvas.width = 720;					/*duzina canvasa*/
        this.canvas.height = 400;					/*visina */
        this.context = this.canvas.getContext("2d");		/*ima kontext 2D*/
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);		/*pozivanje elemenata u body*/
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);	/*interval updajta*/
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);		/*funkcija koja definise visinu i sirinu*/
    }
}

function component(width, height, color, x, y, type) {		/*definisanje komponente*/
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {						/*definisanje gravitacije i polozaja kretanja na klik*/
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {		/*crash funkcija*/
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();			/*definisanje zidova*/
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(15, height, "blue", x, 0));
        myObstacles.push(new component(15, x - height - gap, "blue", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="Rezultat:" + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}