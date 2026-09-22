import React from 'react'
import styles from "./Footer.module.css"

const Footer = () => {
    return (
        <div>
            <div className={styles.pageFive}>
                <div className={styles.fiveContantMain}>

                    <div className={styles.pageFiveContant}>

                        <div className={styles.contantOne}>
                            <div className={styles.contantHead}>
                                <p>BINK.Publishers</p>
                            </div>
                            <div className={styles.oneContant}>
                                <p>500 Terry Framcine St</p>
                                <p>San Francisco, CA 94158</p>
                                <p>123-456-7890</p>
                                <a href="mailto:info@my-domain.com" className={styles.link}>
                                    info@my-domain.com
                                </a>
                            </div>
                        </div>

                        <div className={styles.contantTwo}>
                            <div className={styles.contantHead}>
                                <p>Shop</p>
                            </div>
                            <div className={styles.twoContant}>
                                <p>FAQ</p>
                                <p>Shipping & Policy</p>
                                <p>Store Policy</p>
                                <p>Payment Methods</p>
                            </div>
                        </div>

                        <div className={styles.contantThree}>
                            <div className={styles.contantHead}>
                                <p>Socials</p>
                            </div>
                            <div className={styles.threeContant}>
                                <p>Facebook</p>
                                <p>Twitter</p>
                                <p>Instagram</p>
                                <p>Pinterest</p>
                            </div>
                        </div>

                        <div className={styles.contantFour}>
                            <div className={styles.contantHead}>
                                <p>Be the First to Know</p>
                            </div>
                            <div className={styles.fourContant}>
                                <p>Sine up for our newsletter</p>
                                <p>Enter your email here*</p>
                                <input className={styles.input} type="text" name="" id="" />
                                <div className={styles.subscribeMain}>
                                    <div className={styles.subscribeOne}>
                                        <p ><span className={styles.spanOne}>Yes,subscribe mes</span> <br /> to your <br /> <span className={styles.spanOne}>newsletter</span> </p>
                                    </div>
                                    <div className={styles.subscribeTwo}>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Footer