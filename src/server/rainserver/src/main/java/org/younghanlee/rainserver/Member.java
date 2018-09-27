package org.younghanlee.rainserver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import org.json.JSONArray;
import org.json.JSONObject;

public class Member {
	private String name;
	private int icon;
	private int health;
	private int regen;
	private int strength;
	private int speed;
	private int jeito;
	private HashMap<Integer, Integer> skills;
	private HashMap<Integer, Integer> modifiers;
	
	public Member(String name, int icon) {
		this.name = name;
		this.icon = icon;
		this.speed = 50;
		this.strength = 50;
		this.health = 5;
		this.regen = 10;
		this.jeito = 5;
		this.skills = new HashMap<Integer, Integer>();
		this.modifiers = new HashMap<Integer, Integer>();
	}
	
	public String getName() {
		return this.name;
	}
	
	public int getIcon() {
		return this.icon;
	}
	
	public int getHealth() {
		return this.health;
	}
	
	public void setHealth(int n) {
		this.health = n;
	}
	
	public int getRegen() {
		return this.regen;
	}
	
	public void setRegen(int n) {
		this.regen = n;
	}
	
	public int getJeito() {
		return this.jeito;
	}
	
	public void setJeito(int n) {
		this.jeito = n;
	}
	
	public int getStrength() {
		return this.strength;
	}
	
	public void setStrength(int n) {
		this.strength = n;
	}
	
	public int getSpeed() {
		return this.speed;
	}
	
	public void setSpeed(int n) {
		this.speed = n;
	}
	
	public void addSkill(int id, int rank) {
		skills.put(id, rank);
	}
	
	public void addModifier(int n, int time) {
		modifiers.put(n, time);
	}
	
	public JSONArray getModifiers() {
		JSONArray ja = new JSONArray();
		return ja;
	}
	
	public JSONObject change(int id, Player p, int health_change, int jeito_change, 
			HashMap<Integer, Integer> skills_add, ArrayList<Integer> modifiers_add, ArrayList<Integer> modifiers_remove) {
		JSONObject jo = new JSONObject();
		jo.put("id", id);
		jo.put("icon", icon);
		jo.put("name", name);
		jo.put("health_change", health_change);
		jo.put("jeito_change", jeito_change);
		health += health_change;
		jeito += jeito_change;
		if (jeito < 0) {
			jeito = 0;
		}
		if (health <= 0) {
			health = 0;
			p.removeMember(id);

		}
		
		JSONArray skillsArray = new JSONArray();
		JSONArray skillsChangeArray = new JSONArray();
		for (int skill_id: skills_add.keySet()) {
			int rank = skills_add.get(skill_id);
			addSkill(skill_id, rank);
			JSONObject skillObject = new JSONObject();
			skillObject.put("id", skill_id);
			skillObject.put("rank", rank);
			skillsArray.put(skillObject);
			
			Skill s = World.getSkill(skill_id);
			JSONObject newSkillObject = new JSONObject();
			newSkillObject.put("id", skill_id);
			newSkillObject.put("rank", rank);
			newSkillObject.put("name", s.getName());
			newSkillObject.put("description", s.getDescription());
			skillsChangeArray.put(newSkillObject);	
		}
		
		jo.put("skills", skillsArray);
		jo.put("skill_changes", skillsChangeArray);
		
		jo.put("health", health);
		jo.put("jeito", jeito);
		return jo;
	}
	
	public JSONObject toJSONObject(int id) {
		JSONObject jo = new JSONObject();
		jo.put("id", id);
		jo.put("health", health);
		jo.put("jeito", jeito);
		jo.put("name", name);
		jo.put("icon", icon);
		return jo;
	}
}