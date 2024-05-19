import pytest
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
    login_page.login_as_user('testuser@example.com', 'correctpassword')
    assert "Expected Title After Login" in driver.title

def test_invalid_user_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    login_page.login_as_user('testuser@example.com', 'wrongpassword')
    assert "Some Error Occurred, Please try again!" in login_page.get_alert_message()

