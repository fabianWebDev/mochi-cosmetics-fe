import classes from "./Hero.module.css";
import Button from "../common/Button";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="container px-1">
            <div className={`${classes.hero_container} mt-3`}>
                <div className="row">
                    <h1 className={classes.hero_title}>Minas Morgul Cards — Where Legends Linger in Shadow, and Power Lies in Every Draw.</h1>
                </div>
                <div className="row mt-3">
                    <div className="col"></div>
                    <div className={`${classes.hero_button_container} col-md-6`}>
                        <Link to="/products">
                            <Button className="hero_button_color">
                                See more
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;  
