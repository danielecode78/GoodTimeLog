module.exports = (req, res, next) => {
  res.locals.currentPath = req.path;
  let title = "";
  switch (res.locals.currentPath) {
    case "/experiences":
      title =
        "GoodTimeLog - Qui trovi puoi esplorare le esperienze degli altri";
      break;
    case "/experiences/add":
      title = "GoodTimeLog - Aggiungi una nuova esperienza";
      break;
    case "/experiences/myDiary":
      title = "GoodTimeLog - Il mio diario di viaggio";
      break;
    case "/login":
      title = "GoodTimeLog - Effettua il login";
      break;
    case "/register":
      title = "GoodTimeLog - Effettua la registrazione";
      break;
    default:
      title = "GoodTimeLog - Racconta il tempo che vale la pena ricordare";
  }
  if (res.locals.currentPath.endsWith("/edit")) {
    res.locals.pageTitle = "GoodTimeLog - Modifica la tua esperienza";
  } else {
    res.locals.pageTitle = title;
  }
  next();
};
