import React, { useState } from 'react'
import styles from "../Contact/Contact.module.css"
import Footer from '../../Components/Footer/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    // mobile field la numbers மட்டும் allow பண்ணு
    if (name === 'mobile') {
      const onlyNums = value.replace(/[^0-9]/g, '')
      setFormData({ ...formData, mobile: onlyNums })
      setErrors({ ...errors, mobile: '' })
      return
    }

    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'name is required'

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'mobile no is required'
    } else if (formData.mobile.length < 10) {
      newErrors.mobile = 'enter valid 10 digit mobile number'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'enter valid email address'
    }

    if (!formData.message.trim()) newErrors.message = 'message is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    alert('form submitted successfully!')
    setFormData({ name: '', mobile: '', email: '', message: '' })
  }

  return (
    <div>
      
      <div className={styles.pageOne}>

      <div className={styles.contactMain}>
      
        <div className={styles.contactHead}>
          <h3 className={styles.headOne}>for more info</h3>
          <h3 className={styles.headTwo}>contact us</h3>
        </div>

        <div className={styles.bgOne}></div>

        <div className={styles.bgTwo}>
           
          <div className={styles.contantOne}>

            <div className={styles.storeOne}>
              <div className={styles.one}>
              <h3>store 01</h3>
              </div>
              <div className={styles.two}>
                <p>adress</p>
                <p>500 terry francine st.</p>
                <p>sf,ca 94158</p>
              </div>
              <div className={styles.three}>
                <p>tel</p>
                <p>123-456-7890</p>
              </div>
              <div className={styles.four}>
                <p>email</p>
                <a href="mailto:info@my-domain.com" className={styles.storeEmail}>info@my-domain.com</a>
              </div>
              </div>

                 <div className={styles.storeTwo}>
                 <div className={styles.one}>
              <h3>store 02</h3>
              </div>
              <div className={styles.two}>
                <p>adress</p>
                <p>500 terry francine st.</p>
                <p>sf,ca 94158</p>
              </div>
              <div className={styles.three}>
                <p>tel</p>
                <p>123-456-7890</p>
              </div>
              <div className={styles.four}>
                <p>email</p>
                <a href="mailto:info@my-domain.com" className={styles.storeEmail}>info@my-domain.com</a>
              </div>
              </div>
                  <div className={styles.storeThree}>
                 <div className={styles.one}>
              <h3>customer service</h3>
              </div>
              <div className={styles.two}>
                <p>tal</p>
                <p>1-800-000-0000</p>
              </div>
              <div className={styles.three}>
                <p>email</p>
                <a href="mailto:info@my-domain.com" className={styles.storeEmail}>info@my-domain.com</a>
              </div>
              <div className={styles.four}>
                <p><span>0</span> <span>0</span> <span>0</span> <span>0</span></p>
              </div>
              </div>


            </div>
         
          <div className={styles.contantTwo}>
            <div className={styles.fAndLname}>
              <div>
                <label htmlFor="">name</label> 
                <br />
                <input
                  className={styles.fAndLText}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                </div>
              <div>
                <label htmlFor="">mobile no</label>
                <br />
                <input
                  className={styles.fAndLText}
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                />
                {errors.mobile && <p className={styles.errorText}>{errors.mobile}</p>}
              </div>
            </div>
          </div>
          
          <div className={styles.contentThree}>
          <div className={styles.email}>
            <label htmlFor="">email</label> 
            <br />
            <input
              className={styles.emailText}
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>
          </div>

          <div className={styles.contentFour}>
            <div className={styles.message}>
              <label htmlFor="">Type Your Message Here</label> 
              <br />
              <input
                className={styles.textMessage}
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <p className={styles.errorText}>{errors.message}</p>}
            </div>
          </div>

          <div className={styles.contentFive}>
            <div className={styles.submitButtonContainer}>
              <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
            </div>
          </div>
           </div>
      </div>
      </div>

        <div className={styles.footer}>
       <Footer/>
       </div>

  
    </div>
     
  )
}

export default Contact