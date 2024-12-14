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
import javax.servlet.ServletException;
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

@WebServlet(name = "UpdateUserStatus", urlPatterns = {"/UpdateUserStatus"})
public class UpdateUserStatus extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();

        JsonObject responseJson = new JsonObject();

        String userId = request.getParameter("id");

        Session session = HibernateUtil.getSessionFactory().openSession();

        Criteria criteria1 = session.createCriteria(User.class);
        criteria1.add(Restrictions.eq("id", Integer.parseInt(userId)));

        User user = (User) criteria1.uniqueResult();

        //get User status = 1(online)
        User_Status user_Status = (User_Status) session.get(User_Status.class, 2);

        //update user status
        user.setUser_status(user_Status);
        session.update(user);
        
        session.beginTransaction().commit();
        responseJson.addProperty("message", "Updated Succefully");
        session.close();
        
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseJson));
    }
}
