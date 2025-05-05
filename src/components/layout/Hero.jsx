import classes from "./Hero.module.css";

const Hero = () => {
    return (
        <div className={`${classes.hero_container} mt-4`}>
            <div className="row">
                <h1 className={classes.hero_title}>Enter the Shadows of Minas Morgul — Where Darkness Deals the Cards.</h1>
            </div>
            <div className="row mt-3">
                <div className="col"></div>
                <div className={`${classes.hero_button_container} col-md-6`}>
                    <button className={classes.hero_button}>
                        See more
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero;  
