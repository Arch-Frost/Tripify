from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class SignupPage:
    def __init__(self, driver):
        self.driver = driver
        self.url = "http://localhost:3000/signup"

    def open(self):
        self.driver.get(self.url)

    def signup(self, first_name, last_name, email, password, confirm_password):
        self.driver.find_element(By.NAME, "firstName").send_keys(first_name)
        self.driver.find_element(By.NAME, "lastName").send_keys(last_name)
        self.driver.find_element(By.NAME, "email").send_keys(email)
        self.driver.find_element(By.NAME, "password").send_keys(password)
        self.driver.find_element(By.NAME, "confirmPassword").send_keys(confirm_password)
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    def get_warning_message(self):
        try:
            alert = WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.CLASS_NAME, "alert"))
            )
            return alert.text
        except:
            return ""
