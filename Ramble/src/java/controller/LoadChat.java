package controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import entity.Chat;
import entity.Chat_Status;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.logging.SimpleFormatter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.HibernateUtil;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadChat", urlPatterns = {"/LoadChat"})
public class LoadChat extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Gson gson = new Gson();

        Session session = HibernateUtil.getSessionFactory().openSession();
        
        String logged_user_id = request.getParameter("logged_user_id");
        String other_user_id = request.getParameter("other_user_id");

        User logged_user = (User) session.get(User.class, Integer.parseInt(logged_user_id));

        User other_user = (User) session.get(User.class, Integer.parseInt(other_user_id));

        //get chats 
        Criteria criteria1 = session.createCriteria(Chat.class);
        criteria1.add(
                Restrictions.or(
                        Restrictions.and(Restrictions.eq("from_user", logged_user), Restrictions.eq("to_user", other_user)),
                        Restrictions.and(Restrictions.eq("from_user", other_user), Restrictions.eq("to_user", logged_user))
                )
        );
        
        criteria1.addOrder(Order.asc("date_time"));

        List<Chat> chat_list = criteria1.list();

        //chat status = 1 (seen)
        Chat_Status chat_Status = (Chat_Status) session.get(Chat_Status.class, 1);

        //create chat array
        JsonArray chatArray = new JsonArray();
        
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, hh:mm a");
        
        for (Chat chat : chat_list) {
            
            JsonObject chatobject = new JsonObject();
            chatobject.addProperty("message", chat.getMessage());
            chatobject.addProperty("datetime", sdf.format(chat.getDate_time()));
            
            if (chat.getFrom_user().getId() == other_user.getId()) {
                
                //logged user side= right, other_user side = left
                chatobject.addProperty("side", "left");

                if (chat.getChat_Status().getId() == 2) {
                    //update chat status to seen
                    chat.setChat_Status(chat_Status);
                    session.update(chat);
                }

            }else{
                chatobject.addProperty("side", "right");
                chatobject.addProperty("status", chat.getChat_Status().getId());
            }
            
            //add chat object to chat array
            chatArray.add(chatobject);
        }
        
        session.beginTransaction().commit();
        
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(chatArray));
    }

}
