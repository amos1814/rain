package org.younghanlee.rainserver;

import org.java_websocket.WebSocket;
import org.json.JSONObject;

public class Player {
	
	private String name;
	private String email;
	private String player_class;
	private boolean online;
	private int position;
	private int sight;
	
	public int randomInt(int max) {
		return (int)(Math.random() * (max + 1));
	}
	
	public Player(String name, String email, String player_class) {
		this.name = name;
		this.player_class = player_class;
		this.sight = 2;
		
		// Player is offline upon registration. Call Login afterwards
		this.online = false;
		
		int x = randomInt(Constants.MAPWIDTH/2);
		int y = randomInt(Constants.MAPHEIGHT - 1);
		this.position = Constants.MAPWIDTH * y + x;	
	}
	
	public void login(Connection connection) {
		this.online = true;
		World.onlineInc();
		connection.setPlayer(this);
	}
	
	public JSONObject logoff(Connection connection) {
		this.online = false;
		World.onlineDec();
		connection.setPlayer(null);
		return Message.LOGOUT_RESPONSE();
	}
	
	public void move(int newTile) {
		
	}
	
	public boolean isOnline() {
		return online;
	}
	
	public String getName() {
		return name;
	}
	
	public int getPosition() {
		return position;
	}
	
	public int getSight() {
		return sight;
	}
	
	
	public String toString() {
		return name + " " + player_class + " " + online + " "  + position;
	}
	
	public static void main(String[] args) {
		
	}
}