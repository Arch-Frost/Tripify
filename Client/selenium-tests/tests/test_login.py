import pytest
import time
from selenium import webdriver
from pages.login_page import LoginPage

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_valid_user_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    time.sleep(2)
    login_page.login_as_user('testuser@example.com', 'correctpassword')
    time.sleep(2)
    assert "Expected Title After Login" in driver.title

def test_invalid_user_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    time.sleep(2)
    login_page.login_as_user('testuser@example.com', 'wrongpassword')
    time.sleep(2)
    assert "Some Error Occurred, Please try again!" in login_page.get_alert_message()

