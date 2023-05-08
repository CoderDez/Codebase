from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from .models import User

def login_view(req):   
    if req.method == "POST":
        email = req.POST.get("email")
        password = req.POST.get("password")
        user = authenticate(email=email, password=password)
        if user:
            login(req, user)
            # redirect(view)
        else:
            return render(
                req, "login.html", {"error_message": "Invalid credentials. Try again."})

    elif req.method == "GET":
        if hasattr(req, "user"):
            if isinstance(req.user, User):
                logout(req) 
        return render(req, "login.html")