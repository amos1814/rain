package org.younghanlee.rainserver;

import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

public class Message {
	
	public static JSONObject ERROR(int code, String message) {
		JSONObject jo = new JSONObject(); 
		jo.put("type", "ERROR");
		JSONObject payload = new JSONObject();
		payload.put("code", code);
		payload.put("message", message);
		jo.put("payload", payload);
		return jo;
	}
	
	public static JSONObject REGISTER_REQUEST(String user, String email, String password) {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "REGISTER_REQUEST");
		JSONObject payload = new JSONObject();
		payload.accumulate("user", user);
		payload.accumulate("email", email);
		payload.accumulate("password", password);
		jo.accumulate("payload", payload);
		return jo;
	}

	public static JSONObject REGISTER_RESPONSE() {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "REGISTER_RESPONSE");
		JSONObject payload = new JSONObject();
		payload.accumulate("ok", true);
		jo.accumulate("payload", payload);
		return jo;
	}
	
	public static JSONObject LOGIN_REQUEST(String user, String password) {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "LOGIN_REQUEST");
		JSONObject payload = new JSONObject();
		payload.accumulate("user", user);
		payload.accumulate("password", password);
		jo.accumulate("payload", payload);
		return jo;
	}
	
	public static JSONObject LOGIN_RESPONSE(Player p, JSONArray tiles) {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "LOGIN_RESPONSE");
		JSONObject payload = new JSONObject();
		payload.put("position", p.getPosition());
		payload.put("tiles", tiles);
		payload.put("sight", p.getSight());
		payload.put("pace", p.getPace());
		payload.put("rations", p.getRations());
		System.out.println("test");
		payload.put("inventory", p.backpackToJSONArray());
		payload.put("party", p.partyToJSONArray());
		payload.put("eating", p.eatingToJSONArray());
		jo.accumulate("payload", payload);
		return jo;
	}
	
	public static JSONObject LOGOUT_REQUEST() {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "LOGOUT_REQUEST");
		return jo;
	}
	
	public static JSONObject LOGOUT_RESPONSE() {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "LOGOUT_RESPONSE");
		JSONObject payload = new JSONObject();
		payload.accumulate("ok", true);
		jo.accumulate("payload", payload);
		return jo;
	}
	
	public static JSONObject UPDATE(JSONArray tiles) {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "UPDATE");
		JSONObject payload = new JSONObject();
		payload.put("tiles", tiles);
		jo.accumulate("payload", payload);
		return jo;
	}
	
	public static JSONObject EVENT_RESPONSE(JSONObject payload) {
		JSONObject jo = new JSONObject(); 
		jo.accumulate("type", "EVENT_RESPONSE");
		jo.accumulate("payload", payload);
		System.out.println(jo.toString());
		return jo;
	}
	
	public static void main(String[] args) {
		
	}
}