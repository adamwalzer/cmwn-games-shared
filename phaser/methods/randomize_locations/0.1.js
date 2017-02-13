export default function (platformOptsArray = [], locationsArray = []) {
    return _.map(platformOptsArray, platformOpts => {
        var location = locationsArray.splice(Math.floor(Math.random() * locationsArray.length), 1)[0];
        platformOpts.left = location[0];
        platformOpts.top = location[1];
        return platformOpts;
    });
}
