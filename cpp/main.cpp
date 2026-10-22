#include  crow_all.h
#include json.hpp

// Include algorithm implementations
#include algorithms/fcfs.cpp
#include algorithms/sstf.cpp
#include algorithms/scan.cpp
// Future includes (place-holders)
// #include algorithms/cscan.cpp
// #include algorithms/look.cpp
// #include algorithms/clook.cpp
// #include algorithms/energy_aware.cpp

using json = nlohmann::json;

json run_all(int diskSize, int headPos, const std::string& direction,
            const std::vector<int>& requestQueue,
            double alpha, double beta,
            double baseEnergy, double energyFactor) {
    json results;
    results[fcfs] = fcfs(diskSize, headPos, direction, requestQueue,
                           alpha, beta, baseEnergy, energyFactor);
    results[sstf] = sstf(diskSize, headPos, direction, requestQueue,
                           alpha, beta, baseEnergy, energyFactor);
    results[scan] = scan(diskSize, headPos, direction, requestQueue,
                           alpha, beta, baseEnergy, energyFactor);
    // Add other algorithms when implemented
    return results;
}

int main() {
    crow::SimpleApp app;

    // Serve static assets (CSS, JS) and templates
    CROW_ROUTE(app, /static/<string>)
    ([](const crow::request& req, crow::response& res, const std::string& path){
        std::string full = static/ + path;
        std::ifstream f(full, std::ios::binary);
        if (!f) { res.code = 404; return; }
        std::ostringstream ss; ss << f.rdbuf();
        res.body = ss.str();
        if (full.ends_with(.css)) res.add_header(Content-Type, text/css);
        else if (full.ends_with(.js)) res.add_header(Content-Type, application/javascript);
        else if (full.ends_with(.png)) res.add_header(Content-Type, image/png);
        else if (full.ends_with(.html)) res.add_header(Content-Type, text/html);
    });

    // Home page – serve the HTML template
    CROW_ROUTE(app, /)
    ([](){
        std::ifstream f(templates/index.html);
        std::ostringstream ss; ss << f.rdbuf();
        return crow::response(ss.str());
    });

    // Simulation endpoint
    CROW_ROUTE(app, /run).methods(crow::HTTPMethod::Post)
    ([](const crow::request& req){
        auto data = json::parse(req.body);
        int diskSize = data[diskSize].get<int>();
        int headPos = data[headPos].get<int>();
        std::string dir = data[direction].get<std::string>();
        std::vector<int> queue;
        for (auto& v : data[requestQueue]) queue.push_back(v.get<int>());
        double alpha = data.value(alpha, 1.0);
        double beta  = data.value(beta, 1.0);
        double baseEnergy = data.value(baseEnergy, 0.0);
        double energyFactor = data.value(energyFactor, 0.0);

        json result = run_all(diskSize, headPos, dir, queue,
                              alpha, beta, baseEnergy, energyFactor);
        return crow::response{result.dump()};
    });

    app.port(8080).multithreaded().run();
    return 0;
}
