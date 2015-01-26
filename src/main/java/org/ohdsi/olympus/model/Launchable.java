package org.ohdsi.olympus.model;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Launchable {

	@JsonProperty("application-name")
	private String name;
	
	@JsonProperty("application-description")
	private String description;
	
	@JsonProperty("url")
	private String url;
	
	@JsonProperty("image-source")
	private String imageSource;
	
	@JsonProperty("custom-anchor-attributes")
	private Map<String, String> customAnchorAttributes;

	@JsonProperty("custom-image-attributes")
	private Map<String, String> customImageAttributes;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getImageSource() {
		return imageSource;
	}

	public Map<String, String> getCustomAnchorAttributes() {
		return customAnchorAttributes;
	}

	public void setCustomAnchorAttributes(Map<String, String> customAnchorAttributes) {
		this.customAnchorAttributes = customAnchorAttributes;
	}

	public Map<String, String> getCustomImageAttributes() {
		return customImageAttributes;
	}

	public void setCustomImageAttributes(Map<String, String> customImageAttributes) {
		this.customImageAttributes = customImageAttributes;
	}
}
