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

@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);
        
        String mobile = request.getParameter("mobile");
        String firstname = request.getParameter("firstname");
        String lastname = request.getParameter("lastName");
        String password = request.getParameter("password");
        Part avatarImage = request.getPart("avatarImage");

        if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Please Enter Mobile Number");
        } else if (!Validation.isMobileNUmberValid(mobile)) {
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (firstname.isEmpty()) {
            responseJson.addProperty("message", "Please Enter First Name");
        } else if (lastname.isEmpty()) {
            responseJson.addProperty("message", "Please Enter Last Name");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please Enter Password");
        } else if (!Validation.isPasswordValid(password)) {
            responseJson.addProperty("message", "Password Must Include One Upper Case Letter,Number "
                    + "and Special Characer and should include at least 8 characters");
        } else {
            Session session = HibernateUtil.getSessionFactory().openSession();

            //search user by mobile(already used mobiles can be registered as new user again)
            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", mobile));

            if (!criteria1.list().isEmpty()) {
                responseJson.addProperty("message", "Mobile Number Already Used");
            } else {
                User user = new User();

                user.setMobile(mobile);
                user.setFirst_name(firstname);
                user.setLast_name(lastname);
                user.setPassword(password);
                user.setRegistered_date_time(new Date());

                //user status = 2 => offline
                User_Status user_Status = (User_Status) session.get(User_Status.class, 2);
                user.setUser_status(user_Status);

                session.save(user);
                session.beginTransaction().commit();

                //check uploded image
                if (avatarImage != null) {

                    String serverPath = request.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + File.separator + "AvatarImages" + File.separator + mobile + ".png";
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }

                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Registered Succefully");

            }

            session.close();

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }

}
