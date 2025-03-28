import classes from "../../styles/Hero.module.css";

const Hero = () => {
    return (
        <div className={`${classes.hero_container} mt-4`}>
            <div className={classes.hero_content}>
                <button className={classes.hero_button}>
                    See more
                </button>
            </div>
        </div>
    )
}

export default Hero;  
