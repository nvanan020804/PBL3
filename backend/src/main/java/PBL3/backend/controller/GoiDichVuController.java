package PBL3.backend.controller;

import PBL3.backend.model.GoiDichVu;
import PBL3.backend.service.GoiDichVuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goidichvu")
@CrossOrigin(origins = "*")
public class GoiDichVuController {

    private final GoiDichVuService goiDichVuService;

    @Autowired
    public GoiDichVuController(GoiDichVuService goiDichVuService) {
        this.goiDichVuService = goiDichVuService;
    }

    @GetMapping
    public ResponseEntity<List<GoiDichVu>> getAllGoiDichVu() {
        List<GoiDichVu> goiDichVuList = goiDichVuService.getAllGoiDichVu();
        return new ResponseEntity<>(goiDichVuList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GoiDichVu> getGoiDichVuById(@PathVariable int id) {
        return goiDichVuService.getGoiDichVuById(id)
                .map(goiDichVu -> new ResponseEntity<>(goiDichVu, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/name/{tenGoi}")
    public ResponseEntity<GoiDichVu> getGoiDichVuByName(@PathVariable String tenGoi) {
        GoiDichVu goiDichVu = goiDichVuService.getGoiDichVuByTen(tenGoi);
        if (goiDichVu != null) {
            return new ResponseEntity<>(goiDichVu, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createGoiDichVu(@RequestBody GoiDichVu goiDichVu) {
        try {
            GoiDichVu newGoiDichVu = goiDichVuService.createGoiDichVu(goiDichVu);
            return new ResponseEntity<>(newGoiDichVu, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoiDichVu(@PathVariable int id, @RequestBody GoiDichVu goiDichVuDetails) {
        try {
            GoiDichVu updatedGoiDichVu = goiDichVuService.updateGoiDichVu(id, goiDichVuDetails);
            return new ResponseEntity<>(updatedGoiDichVu, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoiDichVu(@PathVariable int id) {
        try {
            goiDichVuService.deleteGoiDichVu(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
}