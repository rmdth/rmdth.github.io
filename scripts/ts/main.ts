interface BadgeInfo {
  name?: string;
  description?: string;
  experience?: string;
  url?: string;
}

interface FavoriteBadge {
  badge?: string;
  badge_info?: BadgeInfo;
}

interface SubItem {
  name?: string;
  description?: string;
  icon?: string;
  extra?: string;
  url?: string;
}

interface RightColumnItem {
  label?: string;
  number?: number | string;
  url?: string;
  fat?: SubItem[];
}

interface FriendEntry {
  name?: string;
  avatar?: string;
  description?: string;
  online?: boolean;
  url?: string;
}

type CardBodyEntry = string | { [key: string]: unknown };

interface CardEntry {
  title?: string;
  body?: CardBodyEntry | CardBodyEntry[];
  description?: string;
  items?: CardBodyEntry[];
}

interface ProfileData {
  name?: string;
  real_name?: string;
  description?: string;
  avatar?: string;
  status?: string;
  favorite_badge?: FavoriteBadge;
  right_column_items?: RightColumnItem[];
  friends?: FriendEntry[];
  cards?: CardEntry[];
}

document.addEventListener("DOMContentLoaded", () => {
  void loadProfileData();
});

async function loadProfileData(): Promise<void> {
  try {
    const response = await fetch("./data/profile.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Error al cargar profile.json: ${response.status}`);
    }

    const profile = (await response.json()) as ProfileData;
    loadProfile(profile);
  } catch (error) {
    console.error("No se pudo cargar la información del perfil", error);
  }
}

function loadProfile(profile: ProfileData): void {
  loadDisplayName(profile.name);
  loadRealName(profile.real_name);
  loadDescription(profile.description);
  loadAvatar(profile.avatar);
  loadFavoriteBadge(profile.favorite_badge);
  loadStatus(profile.status);
  loadRightColumn(profile.right_column_items, profile.friends);
  loadCards(profile.cards);
}

function loadDisplayName(name?: string): void {
  if (!name) {
    return;
  }

  const displayNameEl = document.querySelector<HTMLParagraphElement>(
    ".profile .display_name"
  );

  if (!displayNameEl) {
    return;
  }

  const historyEl = displayNameEl.querySelector<HTMLSpanElement>(
    ".name-history"
  );

  if (historyEl) {
    displayNameEl.textContent = `${name} `;
    displayNameEl.append(historyEl);
  } else {
    displayNameEl.textContent = name;
  }
}

function loadRealName(realName?: string): void {
  if (!realName) {
    return;
  }

  const realNameEl = document.querySelector<HTMLParagraphElement>(
    ".profile .real_name"
  );

  if (!realNameEl) {
    return;
  }

  const textNode = Array.from(realNameEl.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE
  );

  if (textNode) {
    textNode.textContent = realName;
  } else {
    realNameEl.prepend(document.createTextNode(realName));
  }
}

function loadDescription(description?: string): void {
  if (!description) {
    return;
  }

  const descriptionEl = document.querySelector<HTMLParagraphElement>(
    ".profile .description p"
  );

  if (!descriptionEl) {
    return;
  }

  descriptionEl.textContent = description;
}

function loadAvatar(avatarSrc?: string): void {
  if (!avatarSrc) {
    return;
  }

  const avatarImg = document.querySelector<HTMLImageElement>(
    ".profile .avatar img"
  );

  if (!avatarImg) {
    return;
  }

  avatarImg.src = avatarSrc;
  avatarImg.alt = `Avatar de ${avatarImg.alt || avatarSrc}`;
}

function loadFavoriteBadge(favoriteBadge?: FavoriteBadge): void {
  if (!favoriteBadge) {
    return;
  }
  const anchor = document.querySelector<HTMLAnchorElement>(
    ".favorite-badge"
  );

  const badgeImg = document.querySelector<HTMLImageElement>(
    ".favorite-badge .badge"
  );
  const badgeNameEl = document.querySelector<HTMLParagraphElement>(
    ".favorite-badge .info p"
  );
  const badgeExperienceEl = document.querySelector<HTMLSpanElement>(
    ".favorite-badge .info span"
  );

  if (favoriteBadge.badge && badgeImg) {
    badgeImg.src = favoriteBadge.badge;
    badgeImg.alt = favoriteBadge.badge_info?.name ?? "Badge";
  }

  if (favoriteBadge.badge_info?.name && badgeNameEl) {
    badgeNameEl.textContent = favoriteBadge.badge_info.name ?? "";
  }

  if (favoriteBadge.badge_info?.experience && badgeExperienceEl) {
    badgeExperienceEl.textContent =
      favoriteBadge.badge_info.experience ?? "100 EXP";
  }

  if (favoriteBadge.badge_info?.description && badgeImg) {
    badgeImg.title = favoriteBadge.badge_info.description ?? "";
  }

  if (favoriteBadge.badge_info?.url && anchor) {
    anchor.href = favoriteBadge.badge_info.url;
  }
}

function loadStatus(status?: string): void {
  if (!status) {
    return;
  }

  const statusEl = document.querySelector<HTMLParagraphElement>(
    ".right-column .status"
  );

  if (!statusEl) {
    return;
  }

  const normalized = status.trim().toLowerCase();

  statusEl.textContent = status;
  statusEl.classList.remove("online", "offline");

  if (normalized === "online") {
    statusEl.classList.add("online");
  } else if (normalized === "offline") {
    statusEl.classList.add("offline");
  }
}

function loadRightColumn(
  items?: RightColumnItem[],
  friends?: FriendEntry[]
): void {
  const listEl = document.querySelector<HTMLDivElement>(
    ".right-column__list"
  );

  if (!listEl) {
    return;
  }

  listEl.innerHTML = "";
  if (items) {
    items.forEach((item) => {
      if (!item.label) {
        return;
      }

      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item");

      const anchor = document.createElement("a");
      anchor.href = item.url ?? "#";

      const labelSpan = document.createElement("span");
      labelSpan.classList.add("a-text");
      labelSpan.textContent = String(item.label);
      anchor.append(labelSpan);
      anchor.textContent += " ";
      if (item.number !== undefined && item.number !== null && item.number !== 0) {
        const numberSpan = document.createElement("span");
        numberSpan.classList.add("item-number");
        numberSpan.textContent = String(item.number);
        anchor.append(numberSpan);
      }
      itemContainer.append(anchor);

      if (item.fat) {
        itemContainer.classList.add("fat");

        const subItemsContainer = document.createElement("ul");
        subItemsContainer.classList.add("sub-items");

        item.fat.forEach((subItem) => {

          const subItemLi = document.createElement("li");
          const anchor = document.createElement("a");
          anchor.href = subItem.url ?? "#";

          const subItemContainer = document.createElement("div");
          subItemContainer.classList.add("sub-item");
          
          const badgeImg = document.createElement("img");
          badgeImg.src = subItem.icon ?? "";
          badgeImg.alt = subItem.name ?? "sub-item";

          subItemContainer.append(badgeImg);
          anchor.append(subItemContainer);
          subItemLi.append(anchor);
          subItemsContainer.append(subItemLi);  
        });

        itemContainer.append(subItemsContainer);
      }

      listEl.append(itemContainer);
    });
  }

  listEl.append(createFriendList(friends));
}

function createFriendList(friends: FriendEntry[] | undefined): HTMLDivElement {
  const friendContainer = document.createElement("div");
  friendContainer.classList.add("item", "friendlist", "fat");

  const headerLink = document.createElement("a");
  headerLink.href = "#";

  const headerLabel = document.createElement("span");
  headerLabel.classList.add("a-text");
  headerLabel.textContent = "Friends";
  headerLink.append(headerLabel);

  headerLink.textContent += " ";

  friendContainer.append(headerLink);

  if (friends === undefined || friends.length === 0) {
    friendContainer.classList.remove("fat");

    const headerCount = document.createElement("span");
    headerCount.classList.add("item-number");
    headerCount.textContent = "0 :(";
    headerLink.append(headerCount);
    return friendContainer;
  }

  const headerCount = document.createElement("span");
  headerCount.classList.add("item-number");
  headerCount.textContent = String(friends.length);
  headerLink.append(headerCount);

  const list = document.createElement("ul");
  list.classList.add("friends");

  friends.forEach((friend) => {
    if (!friend.name) {
      return;
    }

    const listItem = document.createElement("li");

    const friendLink = document.createElement("a");
    friendLink.href = friend.url ?? "#";

    if (friend.online !== undefined) {
      friendLink.classList.add(friend.online ? "online" : "offline");
    }

    const miniAvatar = document.createElement("div");
    miniAvatar.classList.add("mini-avatar");

    if (friend.avatar) {
      const avatarImg = document.createElement("img");
      avatarImg.src = friend.avatar;
      avatarImg.alt = friend.name;
      miniAvatar.append(avatarImg);
    }

    friendLink.append(miniAvatar);

    if (friend.description) {
      const info = document.createElement("div");
      info.classList.add("info");

      const nameParagraph = document.createElement("p");
      nameParagraph.textContent = friend.name;
      info.append(nameParagraph);

      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.textContent = friend.description;
      info.append(descriptionParagraph);

      friendLink.append(info);
    }

    listItem.append(friendLink);
    list.append(listItem);
  });

  friendContainer.append(list);
  return friendContainer;
}

function loadCards(cards?: CardEntry[]): void {
  const cardsContainer = document.querySelector<HTMLDivElement>(".cards");

  if (!cardsContainer) {
    return;
  }

  cardsContainer.innerHTML = "";

  if (!cards || cards.length === 0) {
    return;
  }

  cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card", "border-radius");

    if (card.title) {
      const titleEl = document.createElement("p");
      titleEl.classList.add("card__title");
      titleEl.textContent = card.title;
      cardEl.append(titleEl);
    }

    const bodyEl = document.createElement("div");
    bodyEl.classList.add("card__body");

    const bodyParagraphs = collectCardParagraphs(card);

    if (bodyParagraphs.length > 0) {
      bodyParagraphs.forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        bodyEl.append(paragraph);
      });
    }

    if (bodyEl.childNodes.length > 0) {
      cardEl.append(bodyEl);
    }

    cardsContainer.append(cardEl);
  });
}

function collectCardParagraphs(card: CardEntry): string[] {
  const paragraphs: string[] = [];

  const pushEntry = (entry: CardBodyEntry): void => {
    if (typeof entry === "string") {
      const trimmed = entry.trim();
      if (trimmed) {
        paragraphs.push(trimmed);
      }
      return;
    }

    if (entry && typeof entry === "object") {
      const text = extractCardText(entry);
      if (text) {
        paragraphs.push(text);
      }
    }
  };

  if (card.body !== undefined) {
    if (Array.isArray(card.body)) {
      card.body.forEach(pushEntry);
    } else {
      pushEntry(card.body);
    }
  }

  if (card.description) {
    pushEntry(card.description);
  }

  if (card.items && card.items.length > 0) {
    card.items.forEach(pushEntry);
  }

  return paragraphs;
}

function extractCardText(entry: { [key: string]: unknown }): string | null {
  const textLike = ["text", "value", "description"].flatMap((key) => {
    const candidate = entry[key];
    return typeof candidate === "string" ? [candidate.trim()] : [];
  });

  if (textLike.length > 0) {
    return textLike[0] || null;
  }

  const label = entry["label"];
  const value = entry["value"];

  if (typeof label === "string" && typeof value === "string") {
    return `${label}: ${value}`.trim();
  }

  const stringValues = Object.values(entry)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  return stringValues.length > 0 ? stringValues.join(" ") : null;
}
