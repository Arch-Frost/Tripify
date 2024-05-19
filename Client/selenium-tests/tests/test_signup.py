import pytest
import time
from selenium import webdriver
from pages.signup_page import SignupPage
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_successful_signup(driver):
    signup_page = SignupPage(driver)
    signup_page.open()
    time.sleep(2)
    signup_page.signup('John2', 'Do2e', 'john2.doe@example.com', 'password', 'password')
    #time.sleep(2)
    #WebDriverWait(driver, 2).until(EC.url_contains("login"))
    time.sleep(2)
    assert "Tripify" in driver.title

def test_password_mismatch_error(driver):
    signup_page = SignupPage(driver)
    signup_page.open()
    time.sleep(2)
    signup_page.signup('John', 'Doe', 'john.doe@example.com', 'password', 'differentpassword')
    error_message = signup_page.get_warning_message()
    time.sleep(2)
    assert "Password and Confirm Password must be the same!" in error_message

def test_missing_field_error(driver):
    signup_page = SignupPage(driver)
    signup_page.open()
    time.sleep(2)
    signup_page.signup('John', '', 'john.doe@example.com', 'password', 'password')
    error_message = signup_page.get_warning_message()
    time.sleep(5)
    assert "Please Fill All Fields!" in error_message
    
