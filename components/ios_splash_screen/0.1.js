export default function (props, ref, key) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="ios-splash"
            checkComplete={false}
            completeDelay={6000}
            nextDelay={3000}
            completeOnStart
            hidePrev
        >
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SHARED}ios-start-ball.png`} />
            <skoash.Image className="hidden" src={`${CMWN.MEDIA.SHARED}ios-start-ball-anim.gif`} />
        </skoash.Screen>
    );
}
