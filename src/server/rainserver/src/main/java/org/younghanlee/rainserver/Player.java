package org.younghanlee.rainserver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class Player {
	
	private String name;
	private String email;
	private String passwordHash;
	private String passwordSalt;
	
	private boolean online;
	private Integer position;
	private int x;
	private int y;
	private int tribe;
	
	private int pace;
	private int speed;
	private int rations;
	private ArrayList<Integer> eating;
	
	private int sight;
	private ArrayList<Integer> tilesSeen;
	
	private ArrayList<Integer> party;
	private HashMap<Integer, Integer> backpack;
	
	private Hunt hunt;
	private Decision decision;
	
	private HashSet<Integer> buffer;
	
	public static int randomInt(int max) {
		return (int)(Math.random() * (max + 1));
	}

	
	public Player(String name, String email, String password) {
		this.name = name;
		this.passwordSalt = Password.generateSalt();
		this.passwordHash = Password.multiHash(password, passwordSalt);
		
		this.sight = 1;
		
		// Player is offline upon registration. Call Login afterwards
		this.online = false;
		this.position = null;	
		this.tilesSeen = new ArrayList<Integer>();
		
		this.party = new ArrayList<Integer>();	
		
		this.pace = 2;
		this.speed = 1;
		this.rations = 1;
		
		this.hunt = null;
		
		this.backpack = new HashMap<Integer, Integer>();
		
		eating = new ArrayList<Integer>();
		
		String [] choiceNames = new String[World.numTribes()];
		for (int i=0; i<World.numTribes(); i++) {
			choiceNames[i] = "selectTribe"+ i;
		}
		String story = "Choose your tribe.";
		Decision d = new Decision(choiceNames, story);
		this.decision = d;

		this.buffer = new HashSet<Integer>();
	}
	
	public String getHash() {
		return passwordHash;
	}
	
	public String getSalt() {
		return passwordSalt;
	}
	
	public void login(Connection connection) {
		this.online = true;
		World.onlineInc();
		connection.setPlayer(this);
		if (position != null) {
			Tile t = World.getTile(position);
			t.addVisitor(this.name);
			t.updateNeighbors(this.name, Constants.MAXSIGHT);
		}
	}
	
	public JSONObject logoff(Connection connection) {
		this.online = false;
		World.onlineDec();
		Tile t = World.getTile(position);
		t.removeVisitor(this.name);
		t.updateNeighbors(this.name, Constants.MAXSIGHT);
		connection.setPlayer(null);
		return Message.LOGOUT_RESPONSE();
	}
	
	public void sendDecision(Connection connection) {
		if (decision == null) {
			return;
		}
		JSONObject payload = new JSONObject();
		JSONObject story = new JSONObject();
		story.put("text", decision.getStoryText());
		story.put("buttons", decision.buttons(this));
		payload.put("story", story);
		connection.sendJSON(Message.UPDATE(payload));
	}
	
	public void addToBuffer(int n) {
		buffer.add(n);
	}
	
	public void playerTick(Connection connection, int tick) {
		System.out.println(tick);
		JSONObject payload = new JSONObject();
		
		// Check tiles buffer
		if (!buffer.isEmpty()) {
			JSONArray tiles = new JSONArray();
			// Copy buffer
			ArrayList<Integer> list = new ArrayList<Integer>(buffer);
			
			for (Integer i: list) {
				buffer.remove(i);
				tiles.put(World.getTile(i).toJSONObject());
			}
			payload.put("tiles", tiles);
		}
		
		if (tick % 60 == 0) {
			ArrayList<Integer> copy = new ArrayList<Integer>();
			for (Integer i: eating) {
				copy.add(new Integer(i));
			}
			JSONArray inventory = eat(copy);
			if (inventory.length() > 0) {
				payload.put("inventory", inventory);
			} 
			if (copy.size() > eating.size()) {
				JSONObject story = new JSONObject();
				String message = "";
				// Find out which food ran out and remove from eating
				for (int i: copy) {
					if (!eating.contains(i)) {
						message += "You don't have enough " + World.getItem(i).getName() + " left to eat. ";
					}
				}
				payload.put("eating", eatingToJSONArray());
				story.put("text", message);
				payload.put("story", story);
			}
		}
		
		JSONArray partyArray = regen(tick);
		if (partyArray.length() > 0) {
			payload.put("party", partyArray);
		}
		
		if (payload.length() > 0) {
			connection.sendJSON(Message.UPDATE(payload));
		}
		return;
	}
	
	public boolean legalMove(int range, int x, int y) {
		boolean xl = x >= 0;
		boolean xu = x < World.getWidth();
		boolean yl = y >= 0;
		boolean yu = x < World.getHeight();
		int dist = Math.abs(this.x - x) + Math.abs(this.y - y);
		return xl && xu && yl && yu && dist <= range;
	}
	
	public void setPosition(int position) {
		this.position = position;
	}
	
	public boolean move(int range, int destination) {
		int x = destination % World.getWidth();
		int y = (destination - x)/World.getWidth();
		if (legalMove(range, x, y)) {
			// System.out.println("Legal Move");
			this.x = x;
			this.y = y;
			
			// Remove this player from source tile
			Tile source = World.getTile(position);
			source.removeVisitor(this.name);
			
			// Tell players you are leaving range
			source.updateNeighbors(this.name, Constants.MAXSIGHT);
			
			// Add it to destination tile
			this.position = destination;	
			Tile dest = World.getTile(destination);
			dest.addVisitor(this.name);
			
			this.tilesSeen.addAll(dest.inSight(sight));
			
			// Tell players you are in range
			dest.updateNeighbors(this.name, Constants.MAXSIGHT);
			
			return true;
		} else {
			System.out.println("illegal move");
			return false;
		}
	}
	
	public boolean isOnline() {
		return online;
	}
	
	public String getName() {
		return name;
	}
	
	public Integer getPosition() {
		return position;
	}
	
	public int respawn(int survivor) {
		party.add(survivor);
		World.getMember(survivor).setHealth(1);
		int rp = World.getTribe(tribe).getRespawnPosition();
		move(World.getHeight() * World.getWidth(), rp);
		return rp;
	}
	
	public int getSight() {
		return sight;
	}
	
	public void setSight(int sight) {
		this.sight =  sight;
	}
	
	public int getPace() {
		return pace;
	}
	public void setPace(int n) {
		pace = n;
	}
	
	public int getRations() {
		return rations;
	}
	public void setRations(int n) {
		rations = n;
	}
	
	public void startHunting(String huntOrFish, int weapon, int habitat_id) {
		hunt = new Hunt(huntOrFish, this, weapon, habitat_id);
	}
	
	public void removeDecision() {
		decision = null;
	}
	
	public String stopHunting() {
		String s =  hunt.huntOrFish();
		hunt = null;
		return s;
	}
	
	public Hunt getHunt(){
		return hunt;
	}
	
	public void setDecision(Decision d) {
		decision = d;
	}
	
	public Decision getDecision() {
		return decision;
	}
	
	public void addTilesSeen(int t) {
		tilesSeen.add(t);
	}
	
	public JSONArray tilesSeenArray() {
		JSONArray ja = new JSONArray();
		for (int ts: tilesSeen) {
			ja.put(World.getTile(ts).toJSONObject());
		}
		return ja;
	}
	
	public JSONArray inSightArray() {
		JSONArray ja = new JSONArray();
		for (int ts: World.getTile(position).inSight(sight)) {
			ja.put(World.getTile(ts).toJSONObject());
		}
		return ja;
	}
	
	public void setQuantity(int itemID, int quantity) {
		if (quantity > 0) {
			backpack.put(itemID, quantity);
		} else {
			backpack.remove(itemID);
		}
	}
	
	public int getQuantity(int itemID) {
		if (backpack.containsKey(itemID)){
			return backpack.get(itemID);
		} else return 0;
	}
	
	public JSONArray backpackToJSONArray() {
		JSONArray ja = new JSONArray();
		for (int i: backpack.keySet()) {
			Item item = World.getItem(i);
			ja.put(item.toJSONObject(i, backpack.get(i)));
		}
		return ja;
	}
	
	public int addMember(String name, int icon) {
		Member m = new Member(name, icon);
		int id = World.addMember(m);
		party.add(id);
		return id;
	}
	
	public void removeMember(Integer id) {
		party.remove(id);
	}
	
	public int partySize(){
		return party.size();
	}
	
	public int getPartyMember(int index) {
		return party.get(index);
	}
	
	public JSONArray partyToJSONArray() {
		JSONArray ja = new JSONArray();
		for (int id: party) {
			ja.put(World.getMember(id).toJSONObject(id));
		}
		return ja;
	}
	
	public int Portion(int id) {
		return - rations * 6/eating.size();
	}
	
	public JSONArray eat(ArrayList<Integer> copy) {
		JSONArray changes = new JSONArray();
		for (Integer id: copy) {
			JSONObject item = World.getItem(id).change(id, Portion(id), this, false);
			if (item.getInt("quantity") == 0) {
				eating.remove(id);
			}
			
			changes.put(item);
		}
		return changes;
	}
	
	public JSONArray add_food(Integer id) {
		if (eating.size() < 3 && !eating.contains(id) && backpack.containsKey(id)) {
			eating.add(id);
		}
		return eatingToJSONArray();
	}
	
	public JSONArray remove_food(Integer id) {
		System.out.println("test");
		System.out.println(id);
		System.out.println(eating);
		if (eating.contains(id)) {
			eating.remove(id);
		}
		return eatingToJSONArray();
	}
	
	public JSONArray eatingToJSONArray() {
		JSONArray ja = new JSONArray();
		for (int id: eating) {
			JSONObject jo = new JSONObject();
			jo.put("id", id);
			jo.put("portion", Portion(id));
			ja.put(jo);
		}
		return ja;
	}
	
	public void setTribe(int id) {
		tribe = id;
	}
	
	public Tribe getTribe(int id) {
		return World.getTribe(id);
	}
	
	public JSONArray regen(int tick) {
		JSONArray partyArray = new JSONArray();
		for (Integer id: party) {
			Member m = World.getMember(id);
			int health = m.getHealth();
			if (health < 5) {
				if (tick % m.getRegen() == 0) {
					partyArray.put(m.change(id, this, 1, 0, null, null, null));
				}
			}
		}
		return partyArray;
	}
	
	
	public String toString() {
		return "NAME:" + name + "   ONLINE:" + online + "   POSITION:"  + position;
	}
	
	public static void main(String[] args) {
		
	}
}