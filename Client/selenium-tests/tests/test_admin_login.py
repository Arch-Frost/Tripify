import pytest
from selenium import webdriver
from pages.login_page import LoginPage
import time

@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_valid_admin_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    time.sleep(2)
    login_page.login_as_admin('asad@example.com', 'password')
    time.sleep(2)
    # Update the expected title to match your application's title after successful login
    assert "Tripify" in driver.title

def test_invalid_user_login(driver):
    login_page = LoginPage(driver)
    login_page.open()
    time.sleep(2)
    login_page.login_as_admin('asad2@example.com', 'wrongpassword')
    time.sleep(2)
    # Update the expected error message to match the actual error message displayed
    assert "Admin not found!" in login_page.get_alert_message()
