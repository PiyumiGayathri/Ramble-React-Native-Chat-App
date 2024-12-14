package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validation;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        
        JsonObject requestJson = gson.fromJson(request.getReader(), JsonObject.class);
       
        
        String mobile = requestJson.get("mobile").getAsString();
        String password = requestJson.get("password").getAsString();
        
        System.out.println(mobile);
        System.out.println(password);

        if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Please Enter Mobile Number");
        } else if (!Validation.isMobileNUmberValid(mobile)) {
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please Enter Password");
        } else if (!Validation.isPasswordValid(password)) {
            responseJson.addProperty("message", "Password Must Include One Upper Case Letter,Number "
                    + "and Special Characer and should include at least 8 characters");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();

            //search user by mobile and password
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", mobile));
            criteria1.add(Restrictions.eq("password", password));

            if (!criteria1.list().isEmpty()) {
                User user = (User) criteria1.uniqueResult();
                
                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Sign In Success");
                responseJson.add("user", gson.toJsonTree(user));
            } else {
                 responseJson.addProperty("message", "Invalid Credentials");
            }

            session.close();

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
