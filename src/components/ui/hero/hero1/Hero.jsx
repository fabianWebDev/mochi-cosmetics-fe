import classes from "./Hero.module.css";
import Button from "../../common/Button";
import { Link } from "react-router-dom";
import { storeConfig } from "../../../../config/storeConfig";

const Hero = () => {
    return (
        <div className={`${classes.hero_container}`}>
            <img
                src={storeConfig.hero_background}
                alt="Hero background"
                className={classes.hero_background_image}
            />
            <div className={classes.hero_content}>
                <div className="row">
                    <h1 className={classes.hero_title}>Todos nuestros productos son certificados Cruelty Free y aprobados por Mochi!</h1>
                </div>
                <div className="row mt-3">
                    <div className="col"></div>
                    <div className={`${classes.hero_button_container} col-md-6`}>
                        <Link to="/products">
                            <Button className="hero_button_color">
                                Ver más
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero;  
