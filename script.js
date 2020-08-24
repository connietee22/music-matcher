const app = {};
    app.API_KEY = '377183-similarb-AOY1QJ9Q';

    const $form = $('form');
    const $similar = $(".similar");
    const $musicSearch = $('.musicSearch');
    const $resultResponse = $('.resultResponse');
    const $h2 = $('h2');
    let modifiedArray = [];

    app.randomBands = (similarBands) => {

    // CLEAR modifiedArray for each new search
    modifiedArray.length = 0;

        // REMOVE BANDS WITHOUT ANY PROFILES
        for (let i = 0; i < similarBands.Results.length; {
            if (similarBands.Results[i].wTeaser) {
    modifiedArray.push(i);
            };
        };

        console.log(modifiedArray);

        // START AT THE FIRST ITEM IN THE ARRAY
        let i = 0;

        app.displayBands = () => {

            const similarName = similarBands.Results[modifiedArray[i]].Name;
            const similarDescrip = similarBands.Results[modifiedArray[i]].wTeaser;
            const similarYT = similarBands.Results[modifiedArray[i]].yUrl;

            // DISPLAYS INFO OF RANDOMLY SELECTED SIMILAR BAND
            $similar.append(`
                    <div class="container">
    <h2>${similarName}<span class="rightArrow"> >> </span></h2>
    <p>${similarBands.Results[modifiedArray[i]].wTeaser}</p>
</div>`);

            // declare here as it's the first time it appears
            const $rightArrow = $('.rightArrow');

            // GO THROUGH ENTIRE ARRAY OR MAX 10 BANDS ON RIGHT CLICK
            $rightArrow.on('click', function() {

    $similar.empty();
                i = i+1;
                if (i === modifiedArray.length || i === 10) {
    $similar.append(`
                        <div class="container">
                        <h2>GREEDY, MUCH?</h2>
                        <p>Try another band, you hipster!</p>
                        <div>
                            <img src = "./assets/musicDude.jpg" alt = "hip guy" class = "hipster">
                            <span><p>
                        Photo by Andrea Piacquadio from Pexels</p>
                        </div>`);
                } else {
    app.displayBands();
                };
            });

            const $container = $('.container');
            // DISPLAYS YOUTUBE EMBED (if avail)
            // NOTE: some videos "are not available" -- research says newer videos from official accounts with ads can only be played from public domains, so hoping this will work if I ever publish it!
            if (similarYT) {
    $container.append(`
                <div class="youtube">
                    <a href="${similarYT}"><iframe width="560" height="315" src="${similarYT}" frameborder="0"></iframe></a>
                </div>`);
            };
        };
    };

    app.getSimilar = (band) => {
    $.ajax({
        url: `https://tastedive.com/api/similar`,
        method: 'GET',
        dataType: 'jsonp',
        data: {
            q: band,
            type: 'music',
            info: 1,
            limit: 25,
            k: app.API_KEY
        }
    }).then(function (result) {
        $similar.empty();
        $resultResponse.empty();

        if (result.Similar.Info[0].Type !== "music" || result.Similar.Results < 5) {

            $resultResponse.append(`
                        <div class = "responseBox">
                            <h3>Sorry, no sign of <span class = "bandHilite">"${band}"</span>in our database!</h3>
                        </div>
                        `);

        } else {

            $resultResponse.append(`
                        <div class = "responseBox">
                            <h3>SIMILAR TO <span class = "bandHilite">${band}</span></h3>
                        </div>`);

            console.log(result.Similar);
            app.randomBands(result.Similar);
            app.displayBands();
        };
    });
    };

    app.init = () => {
    $form.on('submit', (e) => {
        e.preventDefault();
        const bandName = $('input[type=text]').val();
        console.log(bandName);
        app.getSimilar(bandName);
        $('input[type=text]').val(' ');
    });
    };

    $(() => app.init());
