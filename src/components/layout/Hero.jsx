import classes from "./Hero.module.css";

const Hero = () => {
    return (
        <div className={`${classes.hero_container} mt-4`}>
            <div className={`${classes.hero_title_container} row`}>
                <h1 className={classes.hero_title}>Welcome to Minas Morgul Cards, your one stop shop for all your card needs!</h1>
            </div>
            <div className={`row`}>
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
