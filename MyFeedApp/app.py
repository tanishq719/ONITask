from flask import Flask, render_template, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from models import *


app = Flask(__name__)

